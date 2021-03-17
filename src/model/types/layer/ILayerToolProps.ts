import IMapToolProps from "../tool/IMapToolProps";

/**
 * This interface provide specification of the layer tool props model.
 * 
 * @author Jiri Hynek
 */
interface ILayerToolProps extends IMapToolProps {
    name: string | undefined;
    data: any; // TODO: specify the type
}
export default ILayerToolProps;