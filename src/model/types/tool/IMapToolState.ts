import IMapObjectState from "../object/IMapObjectState";
import IMapToolConfig from "./IMapToolConfig";
import IMap from "../map/IMap";

/**
 * This interface declares the state of the map tool.
 * It wraps the state since the map tool can work with state objects which needs to be explicitly serialized.
 * 
 * @author Jiri Hynek
 */
interface IMapToolState extends IMapObjectState {

    /**
     * The metod takes config and deserializes the values.
     * 
     * @param config 
     */
    deserialize(config: IMapToolConfig): void;

    /**
     * The method serializes the map tool state. Optionally, a serialized value can be let undefined if it equals the default value.
     * 
     * @param filterDefaults 
     */
    serialize(filterDefaults: boolean | undefined): IMapToolConfig;

    /**
     * It returns the enabled property of the tool state.
     */
    isEnabled(): boolean;

    /**
     * It sets the enabled property of tool state.
     * 
     * @param enabled 
     */
    setEnabled(enabled: boolean): void;

    /**
     * It returns the map property of the tool state.
     */
    getMap(): IMap | undefined;

    /**
     * It sets the map property of the tool state.
     * 
     * @param map  
     */
    setMap(map: IMap): void;
}
export default IMapToolState;