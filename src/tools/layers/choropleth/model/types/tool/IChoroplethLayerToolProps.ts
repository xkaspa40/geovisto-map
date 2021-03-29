import ILayerToolProps from "../../../../../../model/types/layer/ILayerToolProps";
import IChoroplethLayerToolDimensions from "./IChoroplethLayerToolDimensions";

/**
 * This interface provide specification of the choropleth layer tool props model.
 * 
 * @author Jiri Hynek
 */
interface IChoroplethLayerToolProps extends ILayerToolProps {
    dimensions: IChoroplethLayerToolDimensions | undefined;
    polygons: any; // TODO: specify the type
}
export default IChoroplethLayerToolProps;