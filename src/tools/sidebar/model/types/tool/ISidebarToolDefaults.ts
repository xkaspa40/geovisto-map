import IMapToolDefaults from "../../../../../model/types/tool/IMapToolDefaults";
import ISidebarToolConfig from "./ISidebarToolConfig";

/**
 * This interface declares functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
interface ISidebarToolDefaults extends IMapToolDefaults {

    /**
     * It returns default config if no config is given.
     */
    getConfig(): ISidebarToolConfig;
}
export default ISidebarToolDefaults;