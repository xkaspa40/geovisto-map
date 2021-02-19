import AbstractMapObjectState from '../../object/generic/MapObjectState';

/**
 * This class manages state of the tool.
 * It wraps the state since the tool can work with state objects which needs to be explicitly serialized.
 * 
 * @author Jiri Hynek
 */
class AbstractToolState extends AbstractMapObjectState {

    /**
     * It creates a map object state.
     */
    constructor() {
        super();
    }

    /**
     * Help function which reset state with respect to initial props. Optionally, defaults can be set if property is undefined.
     * 
     * @param {*} defaults 
     */
    reset(defaults) {
        super.reset(defaults);

        // set the enabled property 
        this.setEnabled(this.getProps().enabled == undefined && defaults ? defaults.isEnabled() : this.getProps().enabled);

        // if map is set reset map variables 
        this.resetMapVariables(this.getMap(), defaults);
    }

    /**
     * Help function which resets the state properties realated with map if not defined.
     */
    resetMapVariables(defaults) {
    }

    /**
     * The metod takes config and desrializes the values.
     * 
     * @param {*} config 
     */
    deserialize(config) {
        super.deserialize(config);

        // tools properties
        if(config.enabled != undefined) this.setEnabled(config.enabled);
    }

    /**
     * The method serializes the tool state. Optionally, a serialed value can be let undefined if it equals the default value.
     * 
     * @param {*} defaults 
     */
    serialize(defaults) {
        let config = super.serialize(defaults);

        // tools properties
        config.enabled = defaults && this.isEnabled() == this.getDefaults().isEnabled() ? undefined : this.isEnabled();
        
        return config;
    }

    /**
     * It returns the enabled property of the tool state.
     */
    isEnabled() {
        return this.enabled;
    }

    /**
     * It sets the enabled property of tool state.
     * 
     * @param {*} enabled 
     */
    setEnabled(enabled) {
       this.enabled = enabled;
    }

    /**
     * It returns the map property of the tool state.
     */
    getMap() {
        return this.map;
    }

    /**
     * It sets the map property of the tool state.
     * The map can be set only once.
     * 
     * @param {*} map  
     */
    setMap(map) {
       this.map = (this.map == undefined) ? map : this.map;
    }
}
export default AbstractToolState;