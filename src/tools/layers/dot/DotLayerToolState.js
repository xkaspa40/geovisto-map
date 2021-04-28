import AbstractLayerToolState from "../abstract/AbstractLayerToolState";
import DotLayerToolDefaults from "./DotLayerToolDefaults";

/**
 * This class provide functions for using the state of the layer tool.
 * 
 * @author Jiri Hynek
 */
class DotLayerToolState extends AbstractLayerToolState {

    /**
     * It creates a tool state.
     */
    constructor() {
        super();
        this.categoryFilters = [];
    }

    /**
     * It resets state with respect to initial props. Optionally, defaults can be set if property is undefined.
     * 
     * @param {DotLayerToolDefaults} defaults
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
    }

    /**
     * The metod takes config and desrializes the values.
     * 
     * @param {*} config 
     */
    deserialize(config) {
        super.deserialize(config);

        // the layer tool config
        // TODO
    }

    /**
     * The method serializes the tool state. Optionally, defaults can be set if property is undefined.
     * 
     * @param {DotLayerToolDefaults} defaults
     */
    serialize(defaults) {
        let config = super.serialize(defaults);

        // serialize the layer tool properties
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
     * @param {L.layerGroup} layer 
     */
    setLayer(layer) {
        this.layer = layer;
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
     * @param {*} markers 
     */
    setMarkers(markers) {
        this.markers = markers;
    }

    /**
     * Sets rules for category colors
     *
     * @param rules
     */
    setCategoryFilters(rules) {
        this.categoryFilters = rules;
    }

    /**
     * Gets rules for color coding of categories
     *
     * @returns {[]}
     */
    getCategoryFilters() {
        return this.categoryFilters;
    }

    // TODO
}
export default DotLayerToolState;