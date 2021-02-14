import AbstractFilterOperation from "../abstract/AbstractFilterOperation";
import AbstractFiltersManager from "../abstract/AbstractFiltersManager";
import FilterRule from "./FilterRule";

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
    createRule({ dataDomain, label, pattern, transformValue }) {
        let operation = this.getOperation(label);
        if (operation && operation.length > 0) {
            return new FilterRule({ dataDomain, operation: operation[0], pattern, transformValue });
        }
        return new FilterRule({ dataDomain, operation: new AbstractFilterOperation(), pattern, transformValue });
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
        if (filterRules.length === 0) {
            return data;
        }

        const resultData = data.reduce(
            (acc, value) => {
                const doFilter = filterRules.some((filterRule) => {
                    const values = mapData.getItemValues(filterRule.getDataDomain(), value);
                    return values.length === 1 &&
                        !filterRule.getFilterOperation()
                            .match(
                                filterRule.getTransformValue()(values[0]),
                                filterRule.getPattern()
                            );
                })
                return doFilter ? acc : [...acc, value];
            },
            []
        )
        return resultData;
    }
}

export default FiltersManager;
