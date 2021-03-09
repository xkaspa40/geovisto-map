import AbstractFilterOperation from "../abstract/AbstractFilterOperation";
import AbstractFiltersManager from "../abstract/AbstractFiltersManager";
import FilterRule from "./FilterRule";
import AbstractMapData from "../../../../../../model/internal/data/abstract/AbstractMapDataManager";

/**
 * This class provide functions for using filters.
 * 
 * @author Jiri Hynek
 */
class FiltersManager extends AbstractFiltersManager {

    constructor(filterOperations) {
        super();
        this.filterOperations = filterOperations;
    }

    /**
     * The function returns available filter operations.
     */
    getOperations() {
        return this.filterOperations;
    }

    /**
     * The function creates a new filter rule using given operation label.
     * 
     * @param {*} dataDomain 
     * @param {*} label 
     * @param {*} pattern 
     */
    createRule(dataDomain, label, pattern) {
        let operation = this.getOperation(label);
        if(operation && operation.length > 0) {
            return new FilterRule(dataDomain, operation[0], pattern);
        } 
        return new FilterRule(dataDomain, new AbstractFilterOperation(), pattern);
    }

    /**
     * Takes a list of data and applies the given filter rules.
     * Returns a new list of the references to filtered data items.
     * 
     * @param {AbstractMapData} mapData
     * @param {*} data 
     * @param {[FilterRule]} filterRules 
     */
    filterData(mapData, data, filterRules) {
        let resultData = [];

        // prepare arrays to save computation time
        let dataDomains = [];
        let matchFunctions = [];
        let patterns = [];
        for(let i = 0; i < filterRules.length; i++) {
            dataDomains.push(filterRules[i].getDataDomain());
            matchFunctions.push(filterRules[i].getFilterOperation().match);
            patterns.push(filterRules[i].getPattern());
        }

        // go through data
        let doFilter;
        let values;
        for(let i = 0; i < data.length; i++) {
            doFilter = false;
            for(let j = 0; j < filterRules.length; j++) {
                values = mapData.getItemValues(dataDomains[j], data[i]);
                if(values.length == 1) {
                    if(!matchFunctions[j](values[0], patterns[j])) {
                        doFilter = true;
                        break;
                    }
                }
            }
            if(!doFilter) {
                // data item is accepted by all filter rules
                resultData.push(data[i]);
            }
        }

        return resultData;
    }
}
export default FiltersManager;