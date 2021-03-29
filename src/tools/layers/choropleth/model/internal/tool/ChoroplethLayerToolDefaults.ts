import LayerToolDefaults from "../../../../../../model/internal/layer/LayerToolDefaults";
import IChoroplethLayerToolDefaults from "../../types/tool/IChoroplethLayerToolDefaults";
import IChoroplethLayerTool from "../../types/tool/IChoroplethLayerTool";
import IChoroplethLayerToolDimensions from "../../types/tool/IChoroplethLayerToolDimensions";
import MapDimension from "../../../../../../model/internal/dimension/MapDimension";
import IMapDimension from "../../../../../../model/types/dimension/IMapDimension";
import MapDomainArrayManager from "../../../../../../model/internal/domain/generic/MapDomainArrayManager";
import IMapDataDomain from "../../../../../../model/types/data/IMapDataDomain";
import IMapAggregationFunction from "../../../../../../model/types/aggregation/IMapAggregationFunction";
import { TOOL_TYPE } from "../../..";
import SumAggregationFunction from "../../../../../../model/internal/aggregation/basic/SumAggregationFunction";
import CountAggregationFunction from "../../../../../../model/internal/aggregation/basic/CountAggregationFunction";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class ChoroplethLayerToolDefaults extends LayerToolDefaults implements IChoroplethLayerToolDefaults {

    /**
     * It initializes tool defaults.
     */
    public constructor(tool: IChoroplethLayerTool) {
        super(tool);
    }

    /**
     * It returns a unique type string of the tool which is based on the layer it wraps.
     */
    public getType(): string {
        return TOOL_TYPE;
    }

    /**
     * It returns the layer name.
     */
    public getLayerName(): string {
        return "Choropleth layer";
    }

    /**
     * It returns the map of layer dimensions.
     */
    public getDimensions(): IChoroplethLayerToolDimensions {
        return {
            geo: this.getGeoDimension(),
            value: this.getValueDimension(),
            aggregation: this.getAggregationDimension()
        };
    }

    /**
     * It returns the default geo ID dimension.
     */
    public getGeoDimension(): IMapDimension<IMapDataDomain> {
        return new MapDimension(
            "geo",
            this.getDataManager(),
            undefined
        );
    }

    /**
     * It returns the default value dimension.
     */
    public getValueDimension(): IMapDimension<IMapDataDomain> {
        return new MapDimension(
            "value",
            this.getDataManager(),
            undefined
        );
    }

    /**
     * It returns the default aggregation function dimension.
     */
    public getAggregationDimension(): IMapDimension<IMapAggregationFunction> {
        const domainManager = new MapDomainArrayManager(
            [
                new SumAggregationFunction(),
                new CountAggregationFunction()
            ]
        );

        return new MapDimension(
            "aggregation",
            domainManager,
            domainManager.getDefault()
        );
    }
    
    /**
     * It returns default centroids.
     * 
     * TODO: specify the type
     */
    public getPolygons(): any {
        return this.getMapObject().getMap()?.getState().getPolygons();
    }

    /**
     * It returns preferred z index for the choropoleth layer.
     */
    public getZIndex(): number {
        return 350;
    }
}
export default ChoroplethLayerToolDefaults;