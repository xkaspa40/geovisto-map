import IMapToolDefaults from "../../../../../model/types/tool/IMapToolDefaults";
import IFiltersToolConfig from "./IFiltersToolConfig";
import IMapFiltersManager from "../filter/IMapFilterManager";
import IMapFilterRule from "../filter/IMapFilterRule";

/**
 * This interface declares functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
interface IFiltersToolDefaults extends IMapToolDefaults {

    /**
     * It returns default config if no config is given.
     */
    getConfig(): IFiltersToolConfig;

    /**
     * It returns default filters manager.
     */
    getFiltersManager(): IMapFiltersManager;

    /**
     * It returns default filter rules.
     */
    getFilterRules(): IMapFilterRule[];
}
export default IFiltersToolDefaults;