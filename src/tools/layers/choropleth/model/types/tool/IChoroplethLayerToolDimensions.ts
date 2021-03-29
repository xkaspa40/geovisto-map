import ILayerToolDimensions from "../../../../../../model/types/layer/ILayerToolDimensions";
import IMapDimension from "../../../../../../model/types/dimension/IMapDimension";
import IMapDataDomain from "../../../../../../model/types/data/IMapDataDomain";
import IMapAggregationFunction from "../../../../../../model/types/aggregation/IMapAggregationFunction";

/**
 * This interface provide specification of the choropleth layer tool dimensions model.
 * 
 * @author Jiri Hynek
 */
interface IChoroplethLayerToolDimensions extends ILayerToolDimensions {
    geo: IMapDimension<IMapDataDomain>,
    value: IMapDimension<IMapDataDomain>,
    aggregation: IMapDimension<IMapAggregationFunction>
}
export default IChoroplethLayerToolDimensions;