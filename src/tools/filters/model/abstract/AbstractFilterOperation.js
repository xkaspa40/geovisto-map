/**
 * This class wraps a filter operation.
 *
 * @author Jiri Hynek
 */
class AbstractFilterOperation {

    /**
     * It initializes the filter operation.
     */
    constructor() {
    }

    /**
     * It returns the string label of the filter representing operator.
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
        return false;
    }
}

export default AbstractFilterOperation;
