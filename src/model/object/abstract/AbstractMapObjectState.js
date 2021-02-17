/**
 * This class manages state of the tool.
 * It wraps the state since the tool can work with state objects which needs to be explicitly serialized.
 * 
 * @author Jiri Hynek
 */
class AbstractMapObjectState {

    /**
     * It creates a map object state.
     */
    constructor() {
    }

    /**
     * It initializes the state using the initial props. Optionally, defaults can be set if property is undefined.
     * 
     * @param {*} props 
     * @param {*} defaults 
     */
    initialize(props, defaults) {
        
        // get default props if undefined
        this.props = props != undefined ? props : defaults.getProps();
        
        // sets the type of the object (can be set only once in constructor)
        this.setType(defaults.getType());

        // set the id of the object (can be set only once in constructor)
        this.setId(this.props.id == undefined && defaults ? defaults.getId() : this.props.id);

        // resets the state
        this.reset(defaults);
    }

    /**
     * It resets the state to the initial props. Optionally, defaults can be set if property is undefined.
     * 
     * @param {*} defaults 
     */
    reset(defaults) {
    }

    /**
     * It returns the props given by the programmer.
     * 
     * This function should not be overriden.
     */
    getProps() {
        return this.props;
    }

    /**
     * The metod takes config and desrializes the values.
     * 
     * @param {*} config 
     */
    deserialize(config) {
        if(config.id != undefined) this.setId(config.id);
    }

    /**
     * The method serializes the tool state. Optionally, a serialed value can be let undefined if it equals the default value.
     * 
     * @param {*} defaults 
     */
    serialize(defaults) {
        return {
            type: this.getType(),
            id: this.getId(),
        }
    }

    /**
     * It return props given by the programmer.
     * 
     * This function should not be overriden.
     */
    getProps() {
        return this.props;
    }

    /**
     * It returns the type property of the tool state.
     */
    getType() {
        return this.type;
    }

    /**
     * It sets the type property of the tool state.
     * It can be set only once.
     * 
     * @param {*} type 
     */
    setType(type) {
       this.type = (this.type == undefined) ? type : this.type;
    }

    /**
     * It returns the id property of the tool state.
     */
    getId() {
        return this.id;
    }

    /**
     * It sets the id property of the tool state.
     * It can be set only once.
     * 
     * @param {*} id 
     */
    setId(id) {
       this.id = (this.id == undefined) ? id : this.id;
    }

}
export default AbstractMapObjectState;
