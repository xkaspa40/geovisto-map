import IMapToolDefaults from "../../../../../model/types/tool/IMapToolDefaults";
import ISettingsToolConfig from "./ISettingsToolConfig";

/**
 * This interface declares functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
interface ISettingsToolDefaults extends IMapToolDefaults {

    /**
     * It returns default config if no config is given.
     */
    getConfig(): ISettingsToolConfig;
}
export default ISettingsToolDefaults;