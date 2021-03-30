import DrawingLayerToolTabControlDefaults from './DrawingLayerToolTabControlDefaults';
import DrawingLayerToolTabControlState from './DrawingLayerToolTabControlState';
import AbstractLayerToolTabControl from '../../abstract/sidebar/AbstractLayerToolTabControl';
import SidebarInputFactory from '../../../../inputs/SidebarInputFactory';

import '../style/drawingLayer.scss';

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
    colorPicker.value = this.getState().getSelectedColor();
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
    const icons = this.getState().iconSrcs;
    const activeIcon = this.getState().getSelectedIcon();
    const activeIndex = icons.indexOf(activeIcon);
    const res = this.createPalette('Pick icon', icons, activeIndex, this.changeIconAction, true);
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

    let newOptions = {
      ...currEl.markerOptions,
      iconUrl: icon,
    };
    let MyCustomMarker = L.Icon.extend({
      options: newOptions,
    });

    const marker = new MyCustomMarker();
    marker.options = newOptions;
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

    const idOpts = data[0][idKey] ? data?.map((d) => ({ value: d[idKey], label: d[idKey] })) : [];

    const result = SidebarInputFactory.createSidebarInput(model.identifier.input, {
      label: model.identifier.label,
      action: this.changeIdentifierAction,
      value: this._getCurrEl()?.identifier,
      options: [{ value: '', label: '' }, ...idOpts],
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

    if (layerType === 'polyline' || layerType === 'polygon' || layerType === 'painted') {
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
    }

    // this.setInputValues(this.getTool().getState().getDataMapping());

    return tab;
  }
}
export default DrawingLayerToolTabControl;
