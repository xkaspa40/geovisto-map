import MapToolState from "../../model/tool/generic/MapToolState";
import AbstractMapSelection from "./model/item/abstract/AbstractMapSelection";
import SelectionToolDefaults from "./SelectionToolDefaults";
import MapSelection from "./model/item/generic/MapSelection";

/**
 * This class provide functions for using selections.
 * 
 * @author Jiri Hynek
 */
class SelectionToolState extends MapToolState {

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

        // set selection
        this.setSelection(this.getProps().selection == undefined && defaults ? defaults.getSelection() : this.getProps().selection);
    }

    /**
     * The metod takes config and desrializes the values.
     * 
     * @param {*} config 
     */
    deserialize(config) {
        super.deserialize(config);

        // deserialize selection
        if(config.selection) {
            let tool = this.getMap().getState().getTools().getById(config.selection.tool);
            if(tool) {
                this.setSelection(new MapSelection(tool, config.selection.ids));
            }
        }
    }

    /**
     * The method serializes the tool state. Optionally, defaults can be set if property is undefined.
     * 
     * @param {SelectionToolDefaults} defaults
     */
    serialize(defaults) {
        let config = super.serialize(defaults);

        // serialize the selection
        let selection = this.getSelection();
        if(selection && selection.getSrcIds().length > 0) {
            config.selection = {
                tool: selection.getTool().getId(),
                ids: selection.getSrcIds()
            };
        }

        return config;
    }

    /**
     * It returns the selection property of the tool state.
     */
    getSelection() {
        return this.selection;
    }

    /**
     * It sets the selection property of the tool state.
     * 
     * @param {AbstractMapSelection} selection
     */
    setSelection(selection) {
       this.selection = selection;
    }
}
export default SelectionToolState;