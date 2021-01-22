import AbstractToolState from "../../model/tool/abstract/AbstractToolState";
import SelectionToolDefaults from "../selection/SelectionToolDefaults";

/**
 * This class provide functions for using selections.
 * 
 * @author Jiri Hynek
 */
class SettingsToolState extends AbstractToolState {

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
     * The metod takes config and desrializes the values.
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