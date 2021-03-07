import AbstractLayerToolState from "../abstract/AbstractLayerToolState";
import ConnectionLayerToolDefaults from "./ConnectionLayerToolDefaults";

/**
 * This class provide functions for using the state of the layer tool.
 * 
 * @author Jiri Hynek
 */
class ConnectionLayerToolState extends AbstractLayerToolState {

    /**
     * It creates a tool state.
     */
    constructor() {
        super();
    }

    /**
     * It initializes the state using the initial props. Optionally, defaults can be set if property is undefined.
     * 
     * @param {*} props 
     * @param {*} defaults 
     */
    initialize(props, defaults) {
        super.initialize(props, defaults);
    }

    /**
     * It resets state with respect to initial props. Optionally, defaults can be set if property is undefined.
     * 
     * @param {ConnectionLayerToolDefaults} defaults 
     */
    reset(defaults) {
        super.reset(defaults);
    }

    /**
     * Help function which resets the state properties realated with map if not defined.
     */
    resetMapVariables(map, defaults) {
        super.resetMapVariables(map, defaults);
        
        let props = this.getProps();
        this.setCentroids(props.centroids == undefined && defaults && map ? defaults.getCentroids() : props.centroids);
    }

    /**
     * The metod takes config and deserializes the values.
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
     * @param {ConnectionLayerToolDefaults} defaults
     */
    serialize(defaults) {
        let config = super.serialize(defaults);

        // serialize the layer tool properties
        // TODO

        return config;
    }

    /**
     * It returns a Leaflet svg layer.
     */
    getLayer() {
        return this.layer;
    }

    /**
     * It sets a Leaflet svg layer.
     * 
     * @param {L.svg} layer 
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
     * @param {*} centroids 
     */
    setCentroids(centroids) {
        this.centroids = centroids;
    }

    /**
     * It returns work data for the force layout algorithm.
     */
    getWorkData() {
        return this.workData;
    }

    /**
     * It sets the work data for the force layout algorithm.
     * 
     * @param {*} workData 
     */
    setWorkData(workData) {
        this.workData = workData;
    }

    // TODO
}
export default ConnectionLayerToolState;