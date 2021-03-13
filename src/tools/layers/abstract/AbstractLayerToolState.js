import MapToolState from "../../../model/tool/generic/MapToolState";
import LayerToolDefaults from "./AbstractLayerToolDefaults";

/**
 * This class provide functions for using the state of the layer tool.
 * 
 * @author Jiri Hynek
 */
class AbstractLayerToolState extends MapToolState {

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

        // the layer tool properties
        this.setLayerName(props.name == undefined && defaults ? defaults.getLayerName() : props.name);
    }

    /**
     * Help function which resets the state properties realated with map if not defined.
     */
    resetMapVariables(map, defaults) {
        super.resetMapVariables(map, defaults);

        let props = this.getProps();
        this.setDataMapping(props.data == undefined && defaults && map ? defaults.getDataMapping() : props.data);
    }

    /**
     * The metod takes config and deserializes the values.
     * 
     * @param config 
     */
    deserialize(config) {
        super.deserialize(config);

        // the layer tool config
        if(config.name != undefined) this.setLayerName(config.name);
        if(config.data != undefined) this.setDataMapping(config.data);
        // TODO data mapping deserialization
    }

    /**
     * The method serializes the tool state. Optionally, defaults can be set if property is undefined.
     * 
     * @param defaults
     */
    serialize(defaults) {
        let config = super.serialize(defaults);

        // serialize the layer tool properties
        config.layerName = defaults && this.getLayerName() == defaults.getLayerName() ? undefined : this.getLayerName();
        config.data = this.getDataMapping(); // do not use defaults
        // TODO data mapping serialization

        return config;
    }

    /**
     * It returns the layer name property of the tool state.
     */
    getLayerName() {
        return this.layerName;
    }

    /**
     * It sets the layer name property of the tool state.
     * 
     * @param layerName 
     */
    setLayerName(layerName) {
       this.layerName = layerName;
    }

    /**
     * It returns the data mapping property of the tool state.
     */
    getDataMapping() {
        return this.dataMapping;
    }

    /**
     * It sets the data mapping property of tool state.
     * 
     * @param dataMapping 
     */
    setDataMapping(dataMapping) {
       this.dataMapping = dataMapping;
    }
}
export default AbstractLayerToolState;