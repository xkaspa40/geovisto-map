import AbstractMapCategory from "../../../../../../model/internal/category/abstract/AbstractMapCategory";
import IMapFilterOperation from "../../../types/filter/IMapFilterOperation";

/**
 * This class wraps the regex filter operation.
 * 
 * @author Jiri Hynek
 */
class RegFilterOperation extends AbstractMapCategory implements IMapFilterOperation {

    /**
     * It creates the regular expression filter operation.
     */
    public constructor() {
        super();
    }

    /**
     * It returns the string label of the filter representing the operator.
     */
    public getName(): string {
        return "reg";
    }

    /**
     * It checks if a value match a regular expression pattern.
     * 
     * @param value 
     * @param pattern 
     */
    public match(value: any, pattern: any): boolean {
        return value.match(new RegExp(pattern, 'g'));
    }
}
export default RegFilterOperation;