import IMapCategory from "../../../../../model/types/category/IMapCategory";

/**
 * This interface declares a filter operation.
 * 
 * @author Jiri Hynek
 */
interface IMapFilterOperation extends IMapCategory {

    /**
     * It performs the filter operation which compare a value with a pattern.
     * 
     * @param {any} value 
     * @param {any} pattern 
     */
    match(value: any, pattern: any): boolean;
}
export default IMapFilterOperation;