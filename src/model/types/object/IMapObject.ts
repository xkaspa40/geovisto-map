import IMapObjectDefaults from "./IMapObjectDefaults";
import IMapObjectState from "./IMapObjectState";
import IMapObjectProps from "./IMapObjectProps";
import IMapObjectConfig from "./IMapObjectConfig";

/**
 * This class provide functions for using map object which can be identified by uniquie string.
 * 
 * @author Jiri Hynek
 */
interface IMapObject {

    /**
     * It returns the props given by the programmer.
     */
    getProps(): IMapObjectProps;

    /**
     * It returns default values of the state properties.
     */
    getDefaults(): IMapObjectDefaults;

    /**
     * It returns the map object state.
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

    /**
     * It sets the config of the object.
     * 
     * @param config 
     */
    setConfig(config: IMapObjectConfig): void
}
export default IMapObject;