import LayerToolState from "../../../model/internal/layer/LayerToolState";
import MarkerLayerToolDefaults from "./MarkerLayerToolDefaults";

/**
 * This class provide functions for using the state of the layer tool.
 * 
 * @author Jiri Hynek
 */
class MarkerLayerToolState extends LayerToolState {

    /**
     * It creates a tool state.
     */
    constructor() {
        super();
    }

    /**
     * It resets state with respect to initial props. Optionally, defaults can be set if property is undefined.
     * 
     * @param defaults 
     */
    reset(defaults) {
        super.reset(defaults);

        // the layer tool properties
        this.setMarkers([]);
        // TODO
    }

    /**
     * Help function which initialize state properties realated with map.
     */
    resetMapVariables(map, defaults) {
        super.resetMapVariables(map, defaults);
        
        let props = this.getProps();
        this.setCentroids(props.centroids == undefined && defaults && map ? defaults.getCentroids() : props.centroids);
    }

    /**
     * The metod takes config and deserializes the values.
     * 
     * @param config 
     */
    deserialize(config) {
        super.deserialize(config);

        // the layer tool config
        // TODO
    }

    /**
     * The method serializes the tool state. Optionally, defaults can be set if property is undefined.
     * 
     * @param defaults
     */
    serialize(defaults) {
        let config = super.serialize(defaults);

        // serialize the layer tool properties
        // TODO

        return config;
    }

    /**
     * It returns a Leaflet layer group.
     */
    getLayer() {
        return this.layer;
    }

    /**
     * It sets a Leaflet layer group.
     * 
     * @param layer 
     */
    setLayer(layer) {
        this.layer = layer;
    }

    /**
     * It returns the centroids.
     */
    getCentroids() {
        return this.centroids;
    }

    /**
     * It sets the centroids.
     * 
     * @param centroids 
     */
    setCentroids(centroids) {
        this.centroids = centroids;
    }

    /**
     * It returns the markers.
     */
    getMarkers() {
        return this.markers;
    }

    /**
     * It sets the markers.
     * 
     * @param markers 
     */
    setMarkers(markers) {
        this.markers = markers;
    }

    // TODO
}
export default MarkerLayerToolState;