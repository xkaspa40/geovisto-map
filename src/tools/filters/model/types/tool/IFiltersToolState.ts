import IMapToolState from "../../../../../model/types/tool/IMapToolState";
import IFiltersToolConfig from "./IFiltersToolConfig";
import IMapFiltersManager from "../filter/IMapFilterManager";
import IMapFilterRule from "../filter/IMapFilterRule";

/**
 * This indetrface declares functions for using filters.
 * 
 * @author Jiri Hynek
 */
interface IFiltersToolState extends IMapToolState {

    /**
     * The metod takes config and deserializes the values.
     * 
     * @param {IFiltersToolConfig} config 
     */
    deserialize(config: IFiltersToolConfig): void;

    /**
     * The method serializes the tool state. Optionally, defaults can be set if property is undefined.
     * 
     * @param {boolean} filterDefaults 
     */
    serialize(defaults: boolean): IFiltersToolConfig;

    /**
     * It updates filter manager.
     * 
     * @param {IMapFiltersManager} manager 
     */
    setFiltersManager(manager: IMapFiltersManager): void;

    /**
     * It returns filter manager
     */
    getFiltersManager(): IMapFiltersManager;

    /**
     * It returns the filterRules property of the tool state.
     */
    getFilterRules(): IMapFilterRule[];

    /**
     * It sets the filterRules property of the tool state.
     * 
     * @param {IMapFilterRule[]} filterRules 
     */
    setFilterRules(filterRules: IMapFilterRule[]): void;
}
export default IFiltersToolState;