import AbstractMapObjectDefaults from "./MapObjectDefaults";
import IMapObject from "../../types/object/IMapObject";
import IMapObjectProps from "../../types/object/IMapObjectProps";
import IMapObjectState from "../../types/object/IMapObjectState";
import IMapObjectDefaults from "../../types/object/IMapObjectDefaults";
import AbstractMapObjectState from "./MapObjectState";
import IMapObjectConfig from "../../types/object/IMapObjectConfig";

/**
 * This class provide functions for using map object which can be identified by uniquie string.
 * 
 * @author Jiri Hynek
 */
class MapObject implements IMapObject {
    
    private props: IMapObjectProps;
    private defaults: IMapObjectDefaults;
    private state: IMapObjectState;

    /**
     * It creates a map object.
     */
    constructor(props : IMapObjectProps | undefined) {
        // create defaults of the object
        this.defaults = this.createDefaults();

        // get default props if undefined
        this.props = props == undefined ? this.defaults.getProps() : props;

        // create state of the object
        this.state = this.createState();

        //console.log("new object:", this.defaults.getType());
    }

    /**
     * It returns the props given by the programmer.
     */
    public getProps(): IMapObjectProps {
        return this.props;
    }

    /**
     * It returns default values of the state properties.
     */
    public getDefaults(): IMapObjectDefaults {
        return this.defaults;
    }

    /**
     * It creates new defaults of the object.
     * 
     * This function can be overriden.
     */
    protected createDefaults(): IMapObjectDefaults {
        return new AbstractMapObjectDefaults(this);
    }

    /**
     * It returns the tool state.
     * 
     * This function should not be overriden.
     */
    public getState(): IMapObjectState {
        return this.state;
    }

    /**
     * It creates new state if the object.
     * 
     * This function can be overriden.
     */
    protected createState(): IMapObjectState {
        return new AbstractMapObjectState(this);
    }

    /**
     * Help function which returns the type of the object.
     */
    public getType() {
        return this.state.getType();
    }

    /**
     * Help function which returns the id of the object.
     */
    public getId() {
        return this.state.getId();
    }
    
    /**
     * It sets a config
     * 
     * @param {IMapObjectConfig} config 
     */
    public setConfig(config: IMapObjectConfig): void {
        // override state by the config if specified in argument
        this.getState().deserialize(config);
    }
}
export default MapObject;