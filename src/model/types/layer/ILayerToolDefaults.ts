import IMapToolDefaults from "../tool/IMapToolDefaults";
import ILayerToolDimensions from "./ILayerToolDimensions";

/**
 * This interface declares functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
interface ILayerToolDefaults extends IMapToolDefaults {

    /**
     * It returns the layer name.
     */
    getLayerName(): string;
    
    /**
     * It returns list of map dimensions.
     */
    getDimensions(): ILayerToolDimensions;
}
export default ILayerToolDefaults;