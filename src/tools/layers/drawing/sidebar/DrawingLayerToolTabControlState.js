import AbstractLayerToolTabControlState from '../../abstract/sidebar/AbstractLayerToolTabControlState';

const ICON_SRCS = [
  'https://upload.wikimedia.org/wikipedia/commons/0/0a/Marker_location.png',
  'https://icons.iconarchive.com/icons/icons-land/vista-map-markers/32/Map-Marker-Flag-1-Right-Azure-icon.png',
];
const COLORS = ['#2ecc71', '#3498db', '#e74c3c', '#f1c40f'];
const STROKES = [
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
}
export default DrawingLayerToolTabControlState;
