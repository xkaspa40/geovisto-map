import IMapToolConfig from "../../../../../model/types/tool/IMapToolConfig";
import ISidebarTabConfig from "../tab/ISidebarTabConfig";

/**
 * This interface provides specification of sidebar tool config model.
 * 
 * It contains only basic data types or further configs.
 * 
 * @author Jiri Hynek
 */
interface ISidebarToolConfig extends IMapToolConfig {
    tabs: ISidebarTabConfig[] | undefined;
}
export default ISidebarToolConfig;