import ILayerToolProps from "../../../../../../model/types/layer/ILayerToolProps";

/**
 * This interface provide specification of the tiles layer tool props model.
 * 
 * @author Jiri Hynek
 */
interface ITilesLayerToolProps extends ILayerToolProps {
    baseMap: string | undefined;
}
export default ITilesLayerToolProps;