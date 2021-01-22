import SidebarTool from "./SidebarTool";
import AbstractToolDefaults from "../../model/tool/abstract/AbstractToolDefaults";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class SidebarToolDefaults extends AbstractToolDefaults {

    /**
     * It creates a tool defaults.
     */
    constructor() {
        super();
    }

    /**
     * Only one sidebar tool should be present in the Geovisto map.
     */
    isSingleton() {
       return true; 
    }

    /**
     * It returns a unique string of the tool type.
     */
    getType() {
        return SidebarTool.TYPE();
    }
}
export default SidebarToolDefaults;