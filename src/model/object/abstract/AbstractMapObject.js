import AbstractMapObjectDefaults from "./AbstractMapObjectDefaults";

/**
 * This class provide functions for using map object which can be identified by uniquie string.
 * 
 * @author Jiri Hynek
 */
class AbstractMapObject {

    /**
     * It creates a map object.
     */
    constructor(props) {
        // get defaults of the object
        this.defaults = props != undefined && props.defaults != undefined ? props.defaults : this.createDefaults();
        console.log("new object:", this.defaults.getType());

        // initialize defaults
        this.defaults.initialize(this);

        // create state of the object
        this.state = props != undefined && props.state != undefined ? props.state : this.createState(props, this.defaults);

        // initialize state
        this.state.initialize(props, this.defaults);
    }

    /**
     * It returns default values of the state properties.
     * 
     * This function should not be overriden.
     */
    getDefaults() {
        return this.defaults;
    }

    /**
     * It creates new defaults of the object.
     * 
     * This function can be overriden.
     */
    createDefaults() {
        return new AbstractMapObjectDefaults();
    }

    /**
     * It returns the tool state.
     * 
     * This function should not be overriden.
     */
    getState() {
        return this.state;
    }

    /**
     * It creates new state if the object.
     * 
     * This function can be overriden.
     */
    createState() {
        return new AbstractMapObjectState();
    }

    /**
     * Help function which returns the props given by the programmer.
     * 
     * This function should not be overriden.
     */
    getProps() {
        return this.state.getProps();
    }

    /**
     * Help function which returns the type of the object.
     */
    getType() {
        return this.state.getType();
    }

    /**
     * Help function which returns the id of the object.
     */
    getId() {
        return this.state.getId();
    }
}
export default AbstractMapObject;