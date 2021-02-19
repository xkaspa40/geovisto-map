import IMapObjectDefaults from "./IMapObjectDefaults";
import IMapObjectState from "./IMapObjectState";
import IMapObjectProps from "./IMapObjectProps";

/**
 * This class provide functions for using map object which can be identified by uniquie string.
 * 
 * @author Jiri Hynek
 */
interface IMapObject {

    /**
     * Help function which returns the props given by the programmer.
     */
    getProps(): IMapObjectProps;

    /**
     * It returns default values of the state properties.
     */
    getDefaults(): IMapObjectDefaults;

    /**
     * It returns the tool state.
     */
    getState(): IMapObjectState;

    /**
     * Help function which returns the type of the object.
     */
    getType(): string;

    /**
     * Help function which returns the id of the object.
     */
    getId(): string;
}
export default IMapObject;