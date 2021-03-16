import SidebarTool from "./SidebarTool";
import ISidebarToolDefaults from "../../types/tool/ISidebarToolDefaults";
import MapToolDefaults from "../../../../../model/internal/tool/MapToolDefaults";
import ISidebarTool from "../../types/tool/ISidebarTool";
import ISidebarToolConfig from "../../types/tool/ISidebarToolConfig";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class SidebarToolDefaults extends MapToolDefaults implements ISidebarToolDefaults {

    /**
     * It creates a tool defaults.
     */
    public constructor(tool: ISidebarTool) {
        super(tool);
    }

    /**
     * It returns the default config.
     */
    public getConfig(): ISidebarToolConfig {
        const config = <ISidebarToolConfig> super.getConfig();
        config.tabs = undefined;
        return config;
    }

    /**
     * It returns a unique string of the tool type.
     */
    public getType(): string {
        return SidebarTool.TYPE();
    }

    /**
     * Only one sidebar tool should be present in the Geovisto map.
     */
    public isSingleton(): boolean {
       return true; 
    }
}
export default SidebarToolDefaults;