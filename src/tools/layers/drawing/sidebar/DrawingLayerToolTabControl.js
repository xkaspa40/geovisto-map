import DrawingLayerToolTabControlDefaults from './DrawingLayerToolTabControlDefaults';
import DrawingLayerToolTabControlState, { ADMIN_LEVELS } from './DrawingLayerToolTabControlState';
import AbstractLayerToolTabControl from '../../abstract/sidebar/AbstractLayerToolTabControl';
import SidebarInputFactory from '../../../../inputs/SidebarInputFactory';

import '../style/drawingLayerTabControl.scss';
import { geoSearch, iconStarter, putMarkerOnMap } from '../util/Marker';
import { debounce } from '../util/functionUtils';

import * as osmtogeojson from 'osmtogeojson';
import * as turf from '@turf/turf';

import { normalStyles, simplifyFeature } from '../util/Poly';

const POLYS = ['polyline', 'polygon', 'painted', 'vertice'];

const C_sidebar_tab_content_class = 'leaflet-sidebar-tab-content';

/**
 * This class provides controls for management of the layer sidebar tab.
 *
 * @author Andrej Tlcina
 */
class DrawingLayerToolTabControl extends AbstractLayerToolTabControl {
  constructor(tool) {
    super(tool);
  }

  /**
   * It creates new defaults of the tab control.
   */
  createDefaults() {
    return new DrawingLayerToolTabControlDefaults();
  }

  /**
   * It creates new state of the tab control.
   */
  createState() {
    return new DrawingLayerToolTabControlState();
  }

  createPalette(label, opts, activeIdx, changeAction, img = false) {
    const inputPalette = document.createElement('div');
    if (label) inputPalette.appendChild(document.createTextNode(label + ': '));
    const wrapper = document.createElement('div');
    wrapper.style.display = 'grid';
    wrapper.style.gridTemplateColumns = 'repeat(4, 1fr)';
    inputPalette.appendChild(wrapper);
    opts.forEach((opt, idx) => {
      let elem = document.createElement('div');
      elem.style.boxSizing = 'border-box';
      elem.style.background = img ? `url(${opt})` : opt;
      elem.style.backgroundRepeat = 'no-repeat';
      elem.style.backgroundPosition = 'center';
      elem.style.backgroundSize = 'contain';
      elem.style.height = '20px';
      elem.style.display = 'inline-block';
      elem.style.cursor = 'pointer';
      if (idx === activeIdx) {
        elem.style.border = '1px solid #333';
      }
      elem.addEventListener('click', () => changeAction(opt));
      wrapper.appendChild(elem);
    });
    return inputPalette;
  }

  createColorPicker() {
    const inputWrapper = document.createElement('div');
    inputWrapper.appendChild(document.createTextNode('Pick color: '));
    const colorPicker = document.createElement('input');
    colorPicker.setAttribute('type', 'color');
    colorPicker.onchange = (e) => this.changeColorAction(e.target.value);
    colorPicker.value = this._getSelected()?.options?.color || this.getState().getSelectedColor();
    inputWrapper.appendChild(colorPicker);
    return inputWrapper;
  }

  createColorPalette() {
    const colors = this.getState().colors;
    const activeColor = this.getState().getSelectedColor();
    const activeIndex = colors.indexOf(activeColor);
    const res = this.createPalette('Pick color', colors, activeIndex, this.changeColorAction);
    return res;
  }

  createIconPalette() {
    const icons = new Set(this.getState().iconSrcs);
    const iconUrl = this._getSelected()?.options?.icon?.options?.iconUrl;
    if (iconUrl) icons.add(iconUrl);
    const activeIcon = this.getState().getSelectedIcon();
    const iconsArr = Array.from(icons);
    const activeIndex = iconsArr.indexOf(activeIcon);
    const res = this.createPalette('Pick icon', iconsArr, activeIndex, this.changeIconAction, true);
    return res;
  }

  /**
   * It acquire selected data mapping from input values.
   */
  getInputValues() {
    // get data mapping model
    let model = this.getDefaults().getDataMappingModel();

    // create new selection
    let dataMapping = {};

    // get selected data domains values
    dataMapping[model.identifier.name] = this.inputId.getValue();

    return dataMapping;
  }

  /**
   * It updates selected input values according to the given data mapping.
   *
   * @param {*} dataMapping
   */
  setInputValues(dataMapping) {
    // get data mapping model
    let model = this.getDefaults().getDataMappingModel();

    // update inputs
    this.inputId.setValue(dataMapping[model.identifier.name]);
  }

  redrawTabContent(layerType) {
    console.log('redrawing sidebar...');
    // get rendered sidebar tab
    let tabElement = document.getElementById(this.getState().getId());

    // create sidebar tab content
    let tabContent = tabElement.getElementsByClassName(C_sidebar_tab_content_class)[0];

    while (tabContent.firstChild) {
      tabContent.removeChild(tabContent.firstChild);
    }

    tabContent.appendChild(this.getTabContent(layerType));
  }

  changeColorAction = (color) => {
    const selectedEl = this._getSelected();
    this.getState().setSelectedColor(color);
    if (selectedEl?.setStyle) selectedEl.setStyle({ color });
    // this.redrawTabContent(selectedEl?.layerType);
  };

  changeIconAction = (icon) => {
    const selectedEl = this._getSelected();
    this.getState().setSelectedIcon(icon);

    let oldIconOptions = selectedEl?.options?.icon?.options || {};
    let newIconOptions = {
      ...oldIconOptions,
      iconUrl: icon,
    };

    const marker = new L.Icon(newIconOptions);
    if (selectedEl) selectedEl.setIcon(marker);
    this.redrawTabContent('marker');
  };

  changeDescriptionAction = (e) => {
    this.changeDesc(e.target.value);
  };

  changeDesc = (inputText) => {
    const selectedEl = this._getSelected();
    const modInputText = this.convertDescToPopText(inputText);

    let popup1 = selectedEl.getPopup();
    if (popup1) {
      popup1.setContent(modInputText);
    } else {
      selectedEl.bindPopup(modInputText);
    }
    // store for import
    selectedEl.popupContent = modInputText;
    // this.getState().setSelectedColor(color);
    if (selectedEl?.setStyle) selectedEl.setStyle(modInputText);
  };

  changeWeightAction = (e) => {
    const weight = Number(e.target.value);
    const selectedEl = this._getSelected();
    this.getState().setSelectedStroke(weight);
    if (selectedEl?.setStyle) selectedEl.setStyle({ weight });
  };

  changeIdentifierAction = (e) => {
    const id = e.target.value;
    const selectedEl = this._getSelected();
    if (selectedEl) selectedEl.identifier = id;

    const data = this.getTool()?.getState()?.map?.state?.data;

    const found = data.find(({ identifier }) => identifier === id);

    let popupText = '';
    Object.keys(found).forEach((key) => {
      popupText += `${key}: ${found[key]}<br />`;
    });

    this.changeDesc(popupText);
    this.redrawTabContent(selectedEl?.layerType);
  };

  changeWhichIdUseAction = (e) => {
    const id = e.target.value;
    const selectedEl = this._getSelected();

    this.state.setIdentifierType(id);

    this.redrawTabContent(selectedEl?.layerType);
  };

  _getCurrEl() {
    return this.getTool().getState().currEl;
  }

  _getSelected() {
    return this.getTool().getState().selectedLayer;
  }

  createBrushSizeControl = () => {
    let paintPoly = this.getState().paintPoly;

    if (!paintPoly.isActive()) return null;

    let { maxBrushSize, minBrushSize } = paintPoly.getBrushSizeConstraints();

    const controlWrapper = document.createElement('div');
    controlWrapper.appendChild(document.createTextNode('Brush size: '));
    const brushSizeControl = document.createElement('input');
    brushSizeControl.setAttribute('type', 'range');
    brushSizeControl.setAttribute('min', minBrushSize);
    brushSizeControl.setAttribute('max', maxBrushSize);
    brushSizeControl.onchange = (e) => paintPoly.resizeBrush(e.target.value);
    brushSizeControl.value = paintPoly.getBrushSize();
    controlWrapper.appendChild(brushSizeControl);
    return controlWrapper;
  };

  createIdentifierInput = (model) => {
    const data = this.getTool()?.getState()?.map?.state?.data;

    const idKey = this.state.getIdentifierType();

    const idOpts = data && data[0][idKey] ? data.map((d) => d[idKey]) : [];

    const result = SidebarInputFactory.createSidebarInput(model.identifier.input, {
      label: model.identifier.label,
      action: this.changeIdentifierAction,
      value: this._getSelected()?.identifier || '',
      options: idOpts,
      placeholder: 'e.g. CZ',
    });

    return result;
  };

  createPickIdentifier = (model) => {
    const data = this.getTool()?.getState()?.map?.state?.data;

    const idOpts = data[0] ? Object.keys(data[0]).map((k) => ({ value: k, label: k })) : [];

    const result = SidebarInputFactory.createSidebarInput(model.idKey.input, {
      label: model.idKey.label,
      action: this.changeWhichIdUseAction,
      value: this.state.getIdentifierType(),
      options: [{ value: '', label: '' }, ...idOpts],
    });

    return result;
  };

  convertDescToPopText = (descText) => {
    if (!descText) return '';
    return descText.replaceAll('\n', '<br />');
  };

  convertDescfromPopText = (popText) => {
    if (!popText) return '';
    return popText.replaceAll('<br />', '\n');
  };

  searchAction = async (e) => {
    const value = e.target.value;
    const featureGroup = this.getTool()?.getState().featureGroup;

    const opts = await geoSearch(featureGroup, value);

    this.getState().setSearchOpts(opts);
    this.inputSearch.changeOptions(opts ? opts.map((opt) => opt.label || '') : []);
    // this.inputSearch.redrawMenu();
  };

  onInputOptClick = (value) => {
    const featureGroup = this.getTool()?.getState().featureGroup;
    const { searchOpts: opts, connectActivated } = this.getState();

    const found = opts.find((opt) => opt.label === value);

    let latlng = L.latLng(0, 0);
    latlng.lat = found?.y || 0;
    latlng.lng = found?.x || 0;
    const iconUrl = found?.raw?.icon || ICON_SRCS[0];
    const marker = putMarkerOnMap(featureGroup, latlng, found?.label, iconUrl, connectActivated);
    this.getTool().applyEventListeners(marker);
    this.getTool().applyTopologyMarkerListeners(marker);
    this.getState().setSelectedIcon(iconUrl);
    this.getState().appendToIconSrcs(iconUrl);
    if (connectActivated) {
      this.getTool().plotTopology();
    }
    this.redrawTabContent('search');
  };

  addIconAction = (e) => {
    const iconUrl = e.target.value;

    const selectedEl = this._getSelected();
    this.getState().appendToIconSrcs(iconUrl);
    this.redrawTabContent(selectedEl?.layerType);
  };

  createConnectCheck = () => {
    const onChange = (val) => this.getState().setConnectActivated(val);
    const { connectActivated } = this.getState();

    const result = this.createCheck(
      connectActivated,
      onChange,
      'connect',
      'By creating new marker while having this choice selected, you will create path between newly created marker and selected marker or last created marker via Topology tool',
    );

    return result;
  };

  createIntersectionCheck = () => {
    const onChange = (val) => this.getState().setIntersectActivated(val);
    const { intersectActivated } = this.getState();

    const result = this.createCheck(
      intersectActivated,
      onChange,
      'intersect',
      'By selecting the option you can create intersects with selected polygon',
    );
    return result;
  };

  createHighQualityCheck = () => {
    const onChange = (val) => this.getState().setHighQuality(val);
    const { highQuality } = this.getState();

    const result = this.createCheck(
      highQuality,
      onChange,
      'high-quality',
      'By selecting the option displayed polygons will be in higher quality, which however means that some operations will take longer to execute',
    );
    return result;
  };

  createCheck = (value, onCheck, prefix, label) => {
    const onChange = (e) => {
      const val = e.target.checked;
      onCheck(val);
    };
    const ID = prefix + '-check-input';
    const inputWrapper = document.createElement('div');
    inputWrapper.className = `${ID}-wrapper check-wrapper`;
    const check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = value;
    check.id = ID;
    check.onchange = onChange;
    const checkLabel = document.createElement('label');
    checkLabel.for = ID;
    checkLabel.innerText = label;
    inputWrapper.appendChild(check);
    inputWrapper.appendChild(checkLabel);
    return inputWrapper;
  };

  fetchAreas = async () => {
    const { countryCode, adminLevel, highQuality } = this.getState();

    if (!countryCode || !adminLevel) return;

    const toolState = this.getTool().getState();

    const endPoint = 'https://overpass-api.de/api/interpreter?data=[out:json];';
    const query = `area["ISO3166-1"="${countryCode}"]->.searchArea;(relation["admin_level"="${adminLevel}"](area.searchArea););out;>;out skel qt;`;

    document.querySelector('.leaflet-container').style.cursor = 'wait';
    this.searchForAreasBtn.setAttribute('disabled', true);
    fetch(endPoint + query)
      .then((response) => response.json())
      .then((data) => {
        const gJSON = osmtogeojson(data);

        const opts = {
          color: this.getState().selectedColor,
          draggable: true,
          transform: true,
        };

        toolState.featureGroup.eachLayer((layer) => {
          if (layer.countryCode === countryCode) toolState.removeLayer(layer);
        });

        gJSON?.features
          ?.filter((feat) => feat?.geometry?.type === 'Polygon')
          ?.forEach((feat) => {
            let coords = feat.geometry.coordinates;
            if (!highQuality) {
              let simplified = simplifyFeature(feat, 0.01);
              coords = simplified.geometry.coordinates;
            }
            let latlngs = L.GeoJSON.coordsToLatLngs(coords, 1);
            let result = new L.polygon(latlngs, { ...opts, ...normalStyles });
            result?.dragging?.disable();
            result.layerType = 'polygon';
            result.countryCode = countryCode;
            toolState.addLayer(result);
          });
        this.errorMsg.innerText = '';
      })
      .catch((err) => {
        this.errorMsg.innerText = 'There was a problem, re-try later.';
        console.error(err);
      })
      .finally(() => {
        document.querySelector('.leaflet-container').style.cursor = '';
        this.searchForAreasBtn.removeAttribute('disabled');
      });
  };

  searchForAreaAction = (e) => {
    const val = e.target.value;
    this.getState().setCountryCode(val);
  };

  pickAdminLevelAction = (e) => {
    const val = e.target.value;
    this.getState().setAdminLevel(val);
  };

  addHeading = (title, elem) => {
    let headingTag = document.createElement('h3');
    headingTag.innerText = title;
    elem.appendChild(headingTag);
  };

  renderSearchInputs = (elem, model) => {
    this.addHeading('Search for place', elem);
    // * labeled text Search
    this.inputSearch = SidebarInputFactory.createSidebarInput(model.search.input, {
      label: model.search.label,
      action: this.searchAction,
      options: [],
      placeholder: 'Press enter for search',
      setData: this.onInputOptClick,
    });
    elem.appendChild(this.inputSearch.create());

    this.inputConnect = this.createConnectCheck();
    elem.appendChild(this.inputConnect);
    // * divider
    elem.appendChild(document.createElement('hr'));

    this.addHeading('Search for area', elem);
    // * labeled text Search
    this.inputSearchForArea = SidebarInputFactory.createSidebarInput(model.searchForArea.input, {
      label: model.searchForArea.label,
      options: this.getState().getSelectCountries(),
      action: this.searchForAreaAction,
      value: this.getState().countryCode || '',
    });
    elem.appendChild(this.inputSearchForArea.create());

    this.inputAdminLevel = SidebarInputFactory.createSidebarInput(model.adminLevel.input, {
      label: model.adminLevel.label,
      options: ADMIN_LEVELS,
      action: this.pickAdminLevelAction,
      value: this.getState().adminLevel,
    });
    elem.appendChild(this.inputAdminLevel.create());

    const hqCheck = this.createHighQualityCheck();
    elem.appendChild(hqCheck);

    this.errorMsg = document.createElement('div');
    this.errorMsg.className = 'error-text';
    this.errorMsg.innerText = '';
    elem.appendChild(this.errorMsg);

    this.searchForAreasBtn = document.createElement('button');
    this.searchForAreasBtn.innerText = 'Submit';
    this.searchForAreasBtn.addEventListener('click', this.fetchAreas);
    elem.appendChild(this.searchForAreasBtn);
  };

  renderDataInputs = (elem, model) => {
    let disableTextFields = !Boolean(this._getSelected());
    // Select Pick Identifier
    this.inputPickIdentifier = this.createPickIdentifier(model);
    elem.appendChild(this.inputPickIdentifier.create());
    this.inputPickIdentifier.setDisabled(disableTextFields);
    // textfield Identifier
    this.inputId = this.createIdentifierInput(model);
    elem.appendChild(this.inputId.create());
    this.inputId.setDisabled(disableTextFields);
    // textarea Description
    this.inputDesc = SidebarInputFactory.createSidebarInput(model.description.input, {
      label: model.description.label,
      action: this.changeDescriptionAction,
      value: this.convertDescfromPopText(this._getSelected()?.getPopup()?.getContent()),
    });
    elem.appendChild(this.inputDesc.create());
    this.inputDesc.setDisabled(disableTextFields);
  };

  renderPolyInputs = (elem, model) => {
    // select stroke thickness
    const thicknessOpts = this.getState().strokes;
    this.inputThickness = SidebarInputFactory.createSidebarInput(model.strokeThickness.input, {
      label: model.strokeThickness.label,
      options: thicknessOpts,
      action: this.changeWeightAction,
      value: this._getSelected()?.options?.weight,
    });
    elem.appendChild(this.inputThickness.create());

    // palette Colors
    this.inputColor = this.createColorPicker();
    elem.appendChild(this.inputColor);
  };

  renderIconInputs = (elem, model) => {
    // palette Icons
    this.inputIcon = this.createIconPalette();
    elem.appendChild(this.inputIcon);

    this.inputUrl = SidebarInputFactory.createSidebarInput(model.iconUrl.input, {
      label: model.iconUrl.label,
      action: this.addIconAction,
      value: '',
    });
    elem.appendChild(this.inputUrl.create());
  };

  /**
   * It returns the sidebar tab pane.
   */
  getTabContent(layerType = null) {
    // tab content
    let tab = document.createElement('div');
    let elem = tab.appendChild(document.createElement('div'));
    elem.classList.add('drawing-sidebar');

    // get data mapping model
    let model = this.getDefaults().getDataMappingModel();

    let paintPolyControl = this.createBrushSizeControl();
    if (paintPolyControl) elem.appendChild(paintPolyControl);

    if (!layerType) return tab;

    if (layerType === 'search') {
      this.renderSearchInputs(elem, model);

      return tab;
    }

    this.renderDataInputs(elem, model);

    if (layerType === 'painted' || layerType === 'polygon') {
      this.inputIntersect = this.createIntersectionCheck();
      elem.appendChild(this.inputIntersect);
    }

    if (POLYS.includes(layerType)) {
      this.renderPolyInputs(elem, model);
    }

    if (layerType === 'marker') {
      this.renderIconInputs(elem, model);
    }

    // this.setInputValues(this.getTool().getState().getDataMapping());

    return tab;
  }
}
export default DrawingLayerToolTabControl;
