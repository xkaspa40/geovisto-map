import IMapObjectConfig from "./IMapObjectConfig";

/**
 * This interface declares the state of a map object.
 * It wraps the state since the map object can work with state objects which needs to be explicitly serialized.
 * 
 * @author Jiri Hynek
 */
interface IMapObjectState {

    /**
     * It resets the state to the initial props.
     */
    reset(): void;

    /**
     * The metod takes config and deserializes the values.
     * 
     * @param config 
     */
    deserialize(config: IMapObjectConfig): void;

    /**
     * The method serializes the map object state. Optionally, a serialed value can be let undefined if it equals the default value.
     * 
     * @param filterDefaults 
     */
    serialize(filterDefaults: boolean | undefined): IMapObjectConfig;

    /**
     * It returns the type property of the map object state.
     */
    getType(): string;

    /**
     * It returns the id property of the map object state.
     */
    getId(): string;

    /**
     * It sets the id property of the map object state.
     * It can be set only once.
     * 
     * @param id 
     */
    setId(id: string): void;
}
export default IMapObjectState;
