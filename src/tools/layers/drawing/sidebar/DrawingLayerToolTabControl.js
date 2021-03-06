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
    currEl.markerOptions = newOptions;

    const marker = new MyCustomMarker();
    currEl.setIcon(marker);
    this.redrawTabContent(currEl?.layerType);
  };

  changeDescriptionAction = (e) => {
    this.changeDesc(e.target.value);
  };

  changeDesc = (inputText) => {
    const currEl = this._getCurrEl();

    let popup1 = currEl.getPopup();
    if (popup1) {
      popup1.setContent(inputText);
    } else {
      currEl.bindPopup(inputText);
    }
    // store for import
    currEl.popupContent = inputText;
    // this.getState().setSelectedColor(color);
    if (currEl?.setStyle) currEl.setStyle(inputText);
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
  };

  _getCurrEl() {
    return this.getTool().getState().currEl;
  }

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

    if (!layerType) return tab;

    // textfield Identifier
    this.inputId = SidebarInputFactory.createSidebarInput(model.identifier.input, {
      label: model.identifier.label,
      action: this.changeIdentifierAction,
      value: this._getCurrEl()?.identifier,
    });
    elem.appendChild(this.inputId.create());

    // textarea Description
    this.inputDesc = SidebarInputFactory.createSidebarInput(model.description.input, {
      label: model.description.label,
      action: this.changeDescriptionAction,
      value: this._getCurrEl()?.getPopup()?.getContent(),
    });
    elem.appendChild(this.inputDesc.create());

    if (layerType === 'polyline' || layerType === 'polygon') {
      // palette Colors
      this.inputColor = this.createColorPalette();
      elem.appendChild(this.inputColor);

      // select stroke thickness
      const thicknessOpts = this.getState().strokes;
      this.inputThickness = SidebarInputFactory.createSidebarInput(model.strokeThickness.input, {
        label: model.strokeThickness.label,
        options: thicknessOpts,
        action: this.changeWeightAction,
        value: this._getCurrEl()?.options?.weight,
      });
      elem.appendChild(this.inputThickness.create());
    }

    if (layerType === 'marker') {
      // palette Icons
      this.inputIcon = this.createIconPalette();
      elem.appendChild(this.inputIcon);
    }

    this.inputFinish = document.createElement('button');
    this.inputFinish.innerText = 'Finish';
    this.inputFinish.addEventListener('click', () => {
      this.getTool().getState().clearPrevPolyFeature();
    });
    elem.appendChild(this.inputFinish);

    // this.setInputValues(this.getTool().getState().getDataMapping());

    return tab;
  }
}
export default DrawingLayerToolTabControl;
