import LayerToolState from "../../../../../../model/internal/layer/LayerToolState";
import IChoroplethLayerToolConfig from "./IChoroplethLayerToolConfig";

/**
 * This interface declares functions for using the state of the layer tool.
 * 
 * @author Jiri Hynek
 */
interface IChoroplethLayerToolState extends LayerToolState {

    /**
     * The metod takes config and deserializes the values.
     * 
     * @param config 
     */
    deserialize(config: IChoroplethLayerToolConfig): void;

    /**
     * The method serializes the tool state. Optionally, defaults can be set if property is undefined.
     * 
     * @param filterDefaults
     */
    serialize(filterDefaults: boolean): IChoroplethLayerToolConfig;

    /**
     * It returns a Leaflet geoJSON layer.
     */
    getGeoJSONLayer(): L.GeoJSON;

    /**
     * It sets a Leaflet geoJSON layer.
     * 
     * @param layer 
     */
    setGeoJSONLayer(layer: L.GeoJSON): void;

    /**
     * It returns a Leaflet popup control.
     * 
     * TODO: specify the type
     */
    getPopup(): any;

    /**
     * It sets a Leaflet popup control.
     * 
     * TODO: specify the type
     * 
     * @param popup 
     */
    setPopup(popup: any): void;

    /**
     * It returns the polygons.
     * 
     * TODO: specify the type
     */
    getPolygons(): any;

    /**
     * It sets the polygons.
     * 
     * TODO: specify the type
     * 
     * @param polygons 
     */
    setPolygons(polygons: any): void;

    /**
     * It returns the hovered item.
     * 
     * TODO: specify the type
     */
    getHoveredItem(): any;

    /**
     * It sets the hovered item.
     * 
     * TODO: specify the type
     * 
     * @param hoveredItem 
     */
    setHoveredItem(hoveredItem: any): void;

    /**
     * It returns the z index.
     */
    getZIndex(): number;

    /**
     * It sets the z index.
     * 
     * @param zindex 
     */
    setZIndex(zindex: number): void;

    // TODO
}
export default IChoroplethLayerToolState;