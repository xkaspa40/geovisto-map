/**
 * This class provide functions for using filters.
 * 
 * @author Jiri Hynek
 */
class AbstractFiltersManager {

    /**
     * It initializes the filter manager.
     */
    constructor() {
    }

    /**
     * It returns available filter operations
     */
    getOperations() {
        return [];
    }

    /**
     * It returns available filter operations
     */
    getOperation(label) {
        let operations = this.getOperations();
        let resultObjects = [];
        if(operations != undefined) {
            for(let i = 0; i < operations.length; i++) {
                if(operations[i].toString() == label) {
                    resultObjects.push(operations[i]);
                }
            }
        }
        return resultObjects;
    }

    /**
     * The function returns available filter operations.
     */
    getOperationLabels() {
        let labels = [];
        let operations = this.getOperations();
        if(operations != undefined) {
            for(let i = 0; i < operations.length; i++) {
                labels.push(operations[i].toString());
            }
        }
        return labels;
    }

    /**
     * The function creates a new filter rule using given operation label.
     * 
     * @param {*} dataDomain 
     * @param {*} label 
     * @param {*} pattern 
     */
    createRule(dataDomain, operation, pattern) {
        return undefined;
    }

    /**
     * Takes a list of data and applies the given filter rules.
     * Returns a new list of the references to filtered data items.
     * 
     * @param {[FilterRule]} filterRules 
     */
    filterData(data, filterRules) {
    }


}
export default AbstractFiltersManager;