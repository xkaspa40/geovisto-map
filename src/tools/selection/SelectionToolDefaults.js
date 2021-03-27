import SelectionTool from "./SelectionTool";
import AbstractToolDefaults from "../../model/tool/abstract/AbstractToolDefaults";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class SelectionToolDefaults extends AbstractToolDefaults {

    /**
     * It creates tool defaults.
     */
    constructor() {
        super();
    }

    /**
     * Only one selection tool should be present in the Geovisto map.
     */
    isSingleton() {
        return true;
    }

    /**
     * It returns a unique string of the tool type.
     */
    getType() {
        return SelectionTool.TYPE();
    }

    /**
     * It returns default map selection.
     * 
     * This function can be overriden;
     */
    getSelection() {
        return SelectionTool.EMPTY_SELECTION();
    }
}
export default SelectionToolDefaults;