import IMapDomain from "../domain/IMapDomain";
import IMapAggregationBucket from "./IMapAggregationBucket";

/**
 * This interface declares functions for using map aggregation function.
 * 
 * @author Jiri Hynek
 */
interface IMapAggregationFunction extends IMapDomain {

    /**
     * It returns a aggregation bucket for aggregation of multiple values.
     */
    getAggregationBucket(): IMapAggregationBucket;
}
export default IMapAggregationFunction;