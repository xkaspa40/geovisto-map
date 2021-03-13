import AbstractLayerToolState from "../abstract/AbstractLayerToolState";
import MapLayerToolDefaults from "./MapLayerToolDefaults";

/**
 * This class provide functions for using the state of the layer tool.
 * 
 * @author Jiri Hynek
 */
class MapLayerToolState extends AbstractLayerToolState {

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

        let props = this.getProps();

        // the map layer tool properties
        this.setBaseMap(props.baseMap == undefined && defaults ? defaults.getBaseMap() : props.baseMap);
        // TODO
    }

    /**
     * The metod takes config and deserializes the values.
     * 
     * @param config 
     */
    deserialize(config) {
        super.deserialize(config);

        // the map layer tool config
        // TODO
    }

    /**
     * The method serializes the tool state. Optionally, defaults can be set if property is undefined.
     * 
     * @param defaults
     */
    serialize(defaults) {
        let config = super.serialize(defaults);

        // serialize the map layer tool properties
        // TODO

        return config;
    }

    /**
     * It returns a Leaflet tile layer.
     */
    getLayer() {
        return this.layer;
    }

    /**
     * It sets a Leaflet tile layer.
     * 
     * @param layer 
     */
    setLayer(layer) {
        this.layer = layer;
    }

    /**
     * It returns a base map ID.
     */
    getBaseMap() {
        return this.baseMap;
    }

    /**
     * It sets a base map ID.
     * 
     * @param baseMap
     */
    setBaseMap(baseMap) {
        this.baseMap = baseMap;
    }

    // TODO
}
export default MapLayerToolState;