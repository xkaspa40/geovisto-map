import { AbstractLayerToolDefaults } from "../abstract";
import DrawingLayerTool from "./DrawingLayerTool";

/**
 * This class provide functions which return the default state values.
 *
 * @author Andrej Tlcina
 */
class DrawingLayerToolDefaults extends AbstractLayerToolDefaults {
  /**
   * It initializes tool defaults.
   */
  constructor() {
    super();
  }

  /**
   * It returns a unique type string of the tool which is based on the layer it wraps.
   */
  getType() {
    return DrawingLayerTool.TYPE();
  }

  /**
   * It returns the layer name.
   */
  getName() {
    return "Drawing layer";
  }
}
export default DrawingLayerToolDefaults;
