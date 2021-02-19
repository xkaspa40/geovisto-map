import IMapObjectConfig from "./IMapObjectConfig";

/**
 * This class manages state of the tool.
 * It wraps the state since the tool can work with state objects which needs to be explicitly serialized.
 * 
 * @author Jiri Hynek
 */
interface IMapObjectState {

    /**
     * It resets the state to the initial props. Optionally, defaults can be set if property is undefined.
     */
    reset(): void;

    /**
     * The metod takes config and desrializes the values.
     * 
     * @param {IMapObjectConfig} config 
     */
    deserialize(config: IMapObjectConfig): void;

    /**
     * The method serializes the tool state. Optionally, a serialed value can be let undefined if it equals the default value.
     * 
     * @param {boolean} useDefaults 
     */
    serialize(useDefaults: boolean): IMapObjectConfig;

    /**
     * It returns the type property of the tool state.
     */
    getType(): string;

    /**
     * It returns the id property of the tool state.
     */
    getId(): string;

    /**
     * It sets the id property of the tool state.
     * It can be set only once.
     * 
     * @param {string} id 
     */
    setId(id: string): void;
}
export default IMapObjectState;
