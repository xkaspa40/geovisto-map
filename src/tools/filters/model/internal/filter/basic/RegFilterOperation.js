import AbstractFilterOperation from "../abstract/AbstractFilterOperation";

/**
 * This class wraps the regex filter operation.
 * 
 * @author Jiri Hynek
 */
class RegFilterOperation extends AbstractFilterOperation {

    constructor() {
        super();
    }

    /**
     * It returns the string label of the filter representing operator.
     */
    toString() {
        return "reg";
    }

    /**
     * It checks if a value match a regular expression pattern.
     * 
     * @param {any} value 
     * @param {any} pattern 
     */
    match(value, pattern) {
        return value.match(new RegExp(pattern, 'g'));
    }
}
export default RegFilterOperation;