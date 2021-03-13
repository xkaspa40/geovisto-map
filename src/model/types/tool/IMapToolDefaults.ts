import IMapObjectDefaults from "../object/IMapObjectDefaults";
import IMapToolConfig from "./IMapToolConfig";

/**
 * This interface declares functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
interface IMapToolDefaults extends IMapObjectDefaults {

    /**
     * It returns default config if no config is given.
     */
    getConfig(): IMapToolConfig;

    /**
     * It returns a logical value whether the tool type is singleton.
     */
    isSingleton(): boolean;

    /**
     * By default, the tool is enabled.
     * 
     * @param enabled 
     */
    isEnabled(): boolean;
}
export default IMapToolDefaults;