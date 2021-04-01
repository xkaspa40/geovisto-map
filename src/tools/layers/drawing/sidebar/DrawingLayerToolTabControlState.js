import AbstractLayerToolTabControlState from '../../abstract/sidebar/AbstractLayerToolTabControlState';
import PaintPoly from '../components/paintPoly';

export const ICON_SRCS = [
  'https://upload.wikimedia.org/wikipedia/commons/0/0a/Marker_location.png',
  'https://icons.iconarchive.com/icons/icons-land/vista-map-markers/32/Map-Marker-Flag-1-Right-Azure-icon.png',
];
export const COLORS = [
  '#1ABC9C',
  '#16A085',
  '#2ECC71',
  '#27AE60',
  '#3498DB',
  '#2980B9',
  '#9B59B6',
  '#8E44AD',
  '#34495E',
  '#2C3E50',
  '#F1C40F',
  '#F39C12',
  '#E67E22',
  '#D35400',
  '#E74C3C',
  '#C0392B',
  '#ECF0F1',
  '#BDC3C7',
  '#95A5A6',
  '#7F8C8D',
];
export const STROKES = [
  { label: 'thin', value: 3 },
  { label: 'medium', value: 5, selected: true },
  { label: 'bold', value: 7 },
];

/**
 * This class manages the state of the sidebar tab.
 * It wraps the state since the sidebar tab can work with state objects which needs to be explicitly serialized.
 *
 * @author Andrej Tlcina
 */
class DrawingLayerToolTabControlState extends AbstractLayerToolTabControlState {
  /**
   * It creates a tab control state.
   */
  constructor() {
    super();

    this.colors = COLORS;
    this.selectedColor = COLORS[0];

    this.strokes = STROKES;
    this.selectedStroke = STROKES[1].value;

    this.iconSrcs = ICON_SRCS;
    this.selectedIcon = ICON_SRCS[0];

    // * element/layer that was enabled and not created yet
    this.enabledEl = null;

    this.identifierType = '';

    this.searchOpts = [];

    this.paintPoly = new PaintPoly({
      tabState: this,
    });
  }

  setEnabledEl(val) {
    this.enabledEl = val;
  }

  getIdentifierType() {
    return this.identifierType;
  }

  setIdentifierType(val) {
    this.identifierType = val;
  }

  getEnabledEl() {
    return this.enabledEl;
  }

  getSelectedColor() {
    return this.selectedColor;
  }

  getSelectedStroke() {
    return this.selectedStroke;
  }

  getSelectedIcon() {
    return this.selectedIcon;
  }

  setSelectedColor(value) {
    this.selectedColor = value;
  }

  setSelectedStroke(value) {
    this.selectedStroke = value;
  }

  setSelectedIcon(value) {
    this.selectedIcon = value;
  }

  setSearchOpts(opts) {
    this.searchOpts = opts;
  }
}
export default DrawingLayerToolTabControlState;
