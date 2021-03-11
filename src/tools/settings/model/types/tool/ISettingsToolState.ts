import IMapToolState from "../../../../../model/types/tool/IMapToolState";
import ISettingsToolConfig from "./ISettingsToolConfig";

/**
 * This class provide functions for using selections.
 * 
 * @author Jiri Hynek
 */
interface ISettingsToolState extends IMapToolState {

    /**
     * The metod takes config and deserializes the values.
     * 
     * @param {ISettingsToolConfig} config 
     */
    deserialize(config: ISettingsToolConfig): void;

    /**
     * The method serializes the tool state. Optionally, defaults can be set if property is undefined.
     * 
     * @param {boolean | undefined} filterDefaults
     */
    serialize(filterDefaults: boolean | undefined): ISettingsToolConfig;
}
export default ISettingsToolState;