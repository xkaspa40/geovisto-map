import MapLayerToolTabControlDefaults from "./MapLayerToolTabControlDefaults";
import MapLayerToolTabControlState from "./MapLayerToolTabControlState";
import AbstractLayerToolTabControl from "../../abstract/sidebar/AbstractLayerToolTabControl";

/**
 * This class provides controls for management of the layer sidebar tab.
 * 
 * @author Jiri Hynek
 */
class MapLayerToolTabControl extends AbstractLayerToolTabControl {

    constructor(tool) {
        super(tool);
    }

    /**
     * It creates new defaults of the tab control.
     */
    createDefaults() {
        return new MapLayerToolTabControlDefaults();
    }

    /**
     * It creates new state of the tab control.
     */
    createState() {
        return new MapLayerToolTabControlState();
    }

    // TODO: This class should be modified in future to provide settings for Map layer (e.g., different tile layers).

}
export default MapLayerToolTabControl;