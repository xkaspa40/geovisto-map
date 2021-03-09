import IMapToolDefaults from "../../../../../model/types/tool/IMapToolDefaults";
import IThemesToolConfig from "./IThemesToolConfig";
import IMapTheme from "../theme/IMapTheme";
import IMapThemesManager from "../theme/IMapThemesManager";

/**
 * This interface declares functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
interface IThemesToolDefaults extends IMapToolDefaults {

    /**
     * It returns default config if no config is given.
     */
    getConfig(): IThemesToolConfig;

    /**
     * It returns default themes manager.
     */
    getThemesManager(): IMapThemesManager;

    /**
     * It returns default theme.
     */
    getTheme(): IMapTheme;
}
export default IThemesToolDefaults;