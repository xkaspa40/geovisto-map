import IMapToolConfig from "../tool/IMapToolConfig";

/**
 * This interface provides specification of the layer tool config model.
 * 
 * It contains only basic data types.
 * 
 * @author Jiri Hynek
 */
interface ILayerToolConfig extends IMapToolConfig {
    name: string | undefined;
    data: any;
}
export default ILayerToolConfig;