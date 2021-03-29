import IMapAggregationFunction from "../../../types/aggregation/IMapAggregationFunction";
import MapDomain from "../../domain/generic/MapDomain";
import IMapAggregationBucket from "../../../types/aggregation/IMapAggregationBucket";

/**
 * This class provides the sum aggregation function.
 * 
 * @author Jiri Hynek
 */
class SumAggregationFunction extends MapDomain implements IMapAggregationFunction {

    /**
     * It initializes event.
     */
    public constructor() {
        super(SumAggregationFunction.TYPE());
    }

    /**
     * Type of the event.
     */
    public static TYPE(): string {
        return "sum";
    }
    
    /**
     * It returns a aggregation bucket for aggregation of multiple values.
     */
    public getAggregationBucket(): IMapAggregationBucket {
        return new class implements IMapAggregationBucket {
            
            private sum: number;

            public constructor() {
                this.sum = 0;
            }
            
            public addValue(value: number): void {
                this.sum += value;
            }
            
            public getValue(): number {
                return this.sum;
            }
        }();
    }
}
export default SumAggregationFunction;