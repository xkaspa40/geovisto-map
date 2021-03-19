import ILayerToolDefaults from "../../../../../../model/types/layer/ILayerToolDefaults";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
interface IChoroplethLayerToolDefaults extends ILayerToolDefaults {
    
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
}
export default IChoroplethLayerToolDefaults;