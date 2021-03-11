import IMapObjectConfig from "../../../../../model/types/object/IMapObjectConfig";
import ISidebarFragmentConfig from "../fragment/ISidebarFragmentConfig";

/**
 * This interface provides specification of sidebar fragment config model.
 * 
 * It contains only basic data types or ruther configs.
 * 
 * @author Jiri Hynek
 */
interface ISidebarTabConfig extends IMapObjectConfig {
    tool: string | undefined;
    enabled: boolean | undefined;
    name: string | undefined;
    icon: string | undefined;
    checkButton: boolean | undefined;
    fragments: ISidebarFragmentConfig[] | undefined;
}
export default ISidebarTabConfig;