import IMapToolConfig from "../../../../../model/types/tool/IMapToolConfig";

/**
 * This interface provides specification of the filters tool config model.
 * 
 * It contains only basic data types.
 * 
 * @author Jiri Hynek
 */
interface IFiltersToolConfig extends IMapToolConfig {
    filterRules: {
        domain: string,
        operation: string,
        pattern: string,
    }[] | undefined;
}
export default IFiltersToolConfig;