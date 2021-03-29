import IMapDomain from "../../../../../model/types/domain/IMapDomain";

/**
 * This interface declares a filter operation.
 * 
 * @author Jiri Hynek
 */
interface IMapFilterOperation extends IMapDomain {

    /**
     * It performs the filter operation which compare a value with a pattern.
     * 
     * @param value 
     * @param pattern 
     */
    match(value: any, pattern: any): boolean;
}
export default IMapFilterOperation;