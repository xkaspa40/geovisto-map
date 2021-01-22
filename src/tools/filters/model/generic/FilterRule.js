import AbstractFilterRule from "../abstract/AbstractFilterRule";

/**
 * This class wraps dataDomain, filterOperation, pattern which represents a filter rule.
 * 
 * @author Jiri Hynek
 */
class FilterRule extends AbstractFilterRule {

    /**
     * 
     * @param {*} dataDomain 
     * @param {*} operation 
     * @param {*} pattern 
     */
    constructor(dataDomain, operation, pattern) {
        super();
        this.dataDomain = dataDomain;
        this.operation = operation;
        this.pattern = pattern;
    }

    /**
     * It returns the the data domain which should be analyzed.
     */
    getDataDomain() {
        return this.dataDomain;
    }

    /**
     * It returns the filter operation used for the filtering.
     */
    getFilterOperation() {
        return this.operation;
    }

    /**
     * It returns the string label of the filter representing operator given by the parameter of constructor.
     */
    getPattern() {
        return this.pattern;
    }
}
export default FilterRule;