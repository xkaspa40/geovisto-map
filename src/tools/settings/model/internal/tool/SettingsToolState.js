import MapToolState from "../../model/tool/generic/MapToolState";
import SelectionToolDefaults from "../../../../selection/model/internal/tool/SelectionToolDefaults";

/**
 * This class provide functions for using selections.
 * 
 * @author Jiri Hynek
 */
class SettingsToolState extends MapToolState {

    /**
     * It creates a tool state.
     */
    constructor() {
        super();
    }

    /**
     * It resets state with respect to initial props. Optionally, defaults can be set if property is undefined.
     * 
     * @param {SelectionToolDefaults} defaults 
     */
    reset(defaults) {
        super.reset(defaults);
    }

    /**
     * The metod takes config and deserializes the values.
     * 
     * @param {*} config 
     */
    deserialize(config) {
        super.deserialize(config);
    }

    /**
     * The method serializes the tool state. Optionally, defaults can be set if property is undefined.
     * 
     * @param {SelectionToolDefaults} defaults
     */
    serialize(defaults) {
        return super.serialize(defaults);
    }
}
export default SettingsToolState;