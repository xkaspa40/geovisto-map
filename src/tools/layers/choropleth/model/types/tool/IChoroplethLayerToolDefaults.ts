import ILayerToolDefaults from "../../../../../../model/types/layer/ILayerToolDefaults";
import IChoroplethLayerToolDimensions from "./IChoroplethLayerToolDimensions";
import IMapDimension from "../../../../../../model/types/dimension/IMapDimension";
import IMapDataDomain from "../../../../../../model/types/data/IMapDataDomain";
import IMapAggregationFunction from "../../../../../../model/types/aggregation/IMapAggregationFunction";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
interface IChoroplethLayerToolDefaults extends ILayerToolDefaults {

    /**
     * It returns the map of layer dimensions.
     */
    getDimensions(): IChoroplethLayerToolDimensions;

    /**
     * It returns the map of layer dimensions.
     */
    getDimensions(): IChoroplethLayerToolDimensions;

    /**
     * It returns the default geo ID dimension.
     */
    getGeoDimension(): IMapDimension<IMapDataDomain>;

    /**
     * It returns the default value dimension.
     */
    getValueDimension(): IMapDimension<IMapDataDomain>;

    /**
     * It returns the default aggregation function dimension.
     */
    getAggregationDimension(): IMapDimension<IMapAggregationFunction>;
    
    /**
     * It returns default centroids.
     * 
     * TODO: specify the type.
     */
    getPolygons(): any;

    /**
     * It returns preferred z index for the choropoleth layer
     */
    getZIndex(): number;

    /**
     * It returns the values scale.
     */
    getScale(): number[];
}
export default IChoroplethLayerToolDefaults;