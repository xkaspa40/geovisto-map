import DrawingLayerToolTabControlDefaults from './DrawingLayerToolTabControlDefaults';
import DrawingLayerToolTabControlState from './DrawingLayerToolTabControlState';
import AbstractLayerToolTabControl from '../../abstract/sidebar/AbstractLayerToolTabControl';
import SidebarInputFactory from '../../../../inputs/SidebarInputFactory';

import '../style/drawingLayerTabControl.scss';
import { geoSearch, putMarkerOnMap } from '../util/Marker';
import { debounce } from '../util/functionUtils';

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
    colorPicker.value = this._getCurrEl()?.options?.color || this.getState().getSelectedColor();
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
    const iconUrl = this._getCurrEl()?.options?.icon?.options?.iconUrl;
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
    const currEl = this._getCurrEl();
    this.getState().setSelectedColor(color);
    if (currEl?.setStyle) currEl.setStyle({ color });
    this.redrawTabContent(currEl?.layerType);
  };

  changeIconAction = (icon) => {
    const currEl = this._getCurrEl();
    this.getState().setSelectedIcon(icon);

    let oldIconOptions = currEl?.options?.icon?.options || {};
    let newIconOptions = {
      ...oldIconOptions,
      iconUrl: icon,
    };

    const marker = new L.Icon(newIconOptions);
    currEl.setIcon(marker);
    this.redrawTabContent(currEl?.layerType);
  };

  changeDescriptionAction = (e) => {
    this.changeDesc(e.target.value);
  };

  changeDesc = (inputText) => {
    const currEl = this._getCurrEl();
    const modInputText = this.convertDescToPopText(inputText);

    let popup1 = currEl.getPopup();
    if (popup1) {
      popup1.setContent(modInputText);
    } else {
      currEl.bindPopup(modInputText);
    }
    // store for import
    currEl.popupContent = modInputText;
    // this.getState().setSelectedColor(color);
    if (currEl?.setStyle) currEl.setStyle(modInputText);
  };

  changeWeightAction = (e) => {
    const weight = Number(e.target.value);
    const currEl = this._getCurrEl();
    this.getState().setSelectedStroke(weight);
    if (currEl?.setStyle) currEl.setStyle({ weight });
  };

  changeIdentifierAction = (e) => {
    const id = e.target.value;
    const currEl = this._getCurrEl();
    if (currEl) currEl.identifier = id;

    const data = this.getTool()?.getState()?.map?.state?.data;

    const found = data.find(({ identifier }) => identifier === id);

    let popupText = '';
    Object.keys(found).forEach((key) => {
      popupText += `${key}: ${found[key]}<br />`;
    });

    this.changeDesc(popupText);
    this.redrawTabContent(currEl?.layerType);
  };

  changeWhichIdUseAction = (e) => {
    const id = e.target.value;
    const currEl = this._getCurrEl();

    this.state.setIdentifierType(id);

    this.redrawTabContent(currEl?.layerType);
  };

  _getCurrEl() {
    return this.getTool().getState().currEl;
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
      value: this._getCurrEl()?.identifier,
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

    const currEl = this._getCurrEl();
    this.getState().appendToIconSrcs(iconUrl);
    this.redrawTabContent(currEl?.layerType);
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

  createCheck = (value, onCheck, prefix, label) => {
    const onChange = (e) => {
      const val = e.target.checked;
      onCheck(val);
    };
    const ID = prefix + '-check-input';
    const inputWrapper = document.createElement('div');
    inputWrapper.className = ID + '-wrapper';
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
      this.inputConnect = this.createConnectCheck();
      elem.appendChild(this.inputConnect);
      // labeld text Search
      this.inputSearch = SidebarInputFactory.createSidebarInput(model.search.input, {
        label: model.search.label,
        action: this.searchAction,
        options: [],
        placeholder: 'Press enter for search',
        setData: this.onInputOptClick,
      });
      elem.appendChild(this.inputSearch.create());
      return tab;
    }

    // textfield Identifier
    this.inputPickIdentifier = this.createPickIdentifier(model);
    elem.appendChild(this.inputPickIdentifier.create());
    // textfield Identifier
    this.inputId = this.createIdentifierInput(model);
    elem.appendChild(this.inputId.create());

    // textarea Description
    this.inputDesc = SidebarInputFactory.createSidebarInput(model.description.input, {
      label: model.description.label,
      action: this.changeDescriptionAction,
      value: this.convertDescfromPopText(this._getCurrEl()?.getPopup()?.getContent()),
    });
    elem.appendChild(this.inputDesc.create());

    if (layerType === 'painted' || layerType === 'polygon') {
      this.inputIntersect = this.createIntersectionCheck();
      elem.appendChild(this.inputIntersect);
    }

    if (POLYS.includes(layerType)) {
      // select stroke thickness
      const thicknessOpts = this.getState().strokes;
      this.inputThickness = SidebarInputFactory.createSidebarInput(model.strokeThickness.input, {
        label: model.strokeThickness.label,
        options: thicknessOpts,
        action: this.changeWeightAction,
        value: this._getCurrEl()?.options?.weight,
      });
      elem.appendChild(this.inputThickness.create());

      // palette Colors
      this.inputColor = this.createColorPicker();
      elem.appendChild(this.inputColor);
    }

    if (layerType === 'marker') {
      // palette Icons
      this.inputIcon = this.createIconPalette();
      elem.appendChild(this.inputIcon);

      this.inputUrl = SidebarInputFactory.createSidebarInput(model.iconUrl.input, {
        label: model.iconUrl.label,
        action: this.addIconAction,
        value: '',
      });
      elem.appendChild(this.inputUrl.create());
    }

    // this.setInputValues(this.getTool().getState().getDataMapping());

    return tab;
  }
}
export default DrawingLayerToolTabControl;
