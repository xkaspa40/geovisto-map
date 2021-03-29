import ILayerToolConfig from "../../../../../../model/types/layer/ILayerToolConfig";

/**
 * This interface provides specification of the choropleth layer tool config model.
 * 
 * It contains only basic data types.
 * 
 * @author Jiri Hynek
 */
interface IChoroplethLayerToolConfig extends ILayerToolConfig {
    data: {
        geo: string | undefined,
        value: string | undefined,
        aggregation: string | undefined
    };
}
export default IChoroplethLayerToolConfig;