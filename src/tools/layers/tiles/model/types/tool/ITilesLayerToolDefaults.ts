import ILayerToolDefaults from "../../../../../../model/types/layer/ILayerToolDefaults";

/**
 * This interface declares functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
interface ITilesLayerToolDefaults extends ILayerToolDefaults {

    /**
     * It returns the preferred base map.
     */
    getBaseMap(): string;
}
export default ITilesLayerToolDefaults;