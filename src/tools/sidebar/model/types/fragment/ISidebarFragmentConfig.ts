import IMapObjectConfig from "../../../../../model/types/object/IMapObjectConfig";

/**
 * This interface provides specification of sidebar fragment config model.
 * 
 * It contains only basic data types.
 * 
 * @author Jiri Hynek
 */
interface ISidebarFragmentConfig extends IMapObjectConfig {
    tool: string | undefined;
    enabled: boolean | undefined;
}
export default ISidebarFragmentConfig;