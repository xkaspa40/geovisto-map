import IMapCategoriesManager from "../../../../../model/types/category/IMapCategoriesManager";
import IMapDataDomain from "../../../../../model/types/data/IMapDataDomain";
import IMapFilterOperation from "./IMapFilterOperation";
import IMapFilterRule from "./IMapFilterRule";

/**
 * This interface declares functions for using filters.
 * 
 * @author Jiri Hynek
 */
interface IMapFiltersManager extends IMapCategoriesManager {

    /**
     * The function creates a new filter rule using given operation label.
     * 
     * @param {IMapDataDomain} dataDomain 
     * @param {IMapFilterOperation} operation 
     * @param {string} pattern 
     */
    createRule(dataDomain: IMapDataDomain, operation: IMapFilterOperation, pattern: string): IMapFilterRule;

    /**
     * Takes a list of data and applies the given filter rules.
     * Returns a new list of the references to filtered data items.
     * 
     * @param {object[]} filterRules 
     * @param {IMapFilterRule[]} filterRules 
     */
    filterData(dataRecords: object[], filterRules: IMapFilterRule[]): object[];
}
export default IMapFiltersManager;