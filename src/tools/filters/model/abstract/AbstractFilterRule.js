/**
 * This class wraps dataDomain, filterOperation, pattern which represents a filter rule.
 * 
 * @author Jiri Hynek
 */
class AbstractFilterRule {

    /**
     * It initializes the filter manager.
     */
    constructor() {
    }

    /**
     * It returns the the data domain which should be analyzed.
     */
    getDataDomain() {
        return undefined;
    }

    /**
     * It returns the filter operation used for the filtering.
     */
    getFilterOperation() {
        return undefined;
    }

    /**
     * It returns the string label of the filter representing operator given by the parameter of constructor.
     */
    getPattern() {
        return undefined;
    }
}
export default AbstractFilterRule;