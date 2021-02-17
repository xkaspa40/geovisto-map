import AbstractFilterOperation from "../abstract/AbstractFilterOperation";

/**
 * This class wraps a filter operation defined by constructor props.
 * 
 * @author Jiri Hynek
 */
class FilterOperation extends AbstractFilterOperation {

    /**
     * 
     * @param {*} label 
     * @param {*} acceptFunction 
     */
    constructor(label, acceptFunction) {
        super();
        this.label = label;
        this.acceptFunction = acceptFunction;
    }

    /**
     * It returns uniquie string label of the filter representing operator given by the parameter of constructor.
     */
    toString() {
        return this.label;
    }

    /**
     * It performs the filter operation which compare a value with a pattern.
     * 
     * @param {any} value 
     * @param {any} pattern 
     */
    match(value, pattern) {
        return this.acceptFunction(value, pattern);
    }
}
export default FilterOperation;