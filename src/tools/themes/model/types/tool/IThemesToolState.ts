import IMapToolState from "../../../../../model/types/tool/IMapToolState";
import IThemesToolConfig from "./IThemesToolConfig";
import IMapThemesManager from "../theme/IMapThemesManager";
import IMapTheme from "../theme/IMapTheme";

/**
 * This interface declares functions for using themes.
 * 
 * @author Jiri Hynek
 */
interface IThemesToolState extends IMapToolState {

    /**
     * The metod takes config and deserializes the values.
     * 
     * @param config 
     */
    deserialize(config: IThemesToolConfig): void;

    /**
     * The method serializes the tool state. Optionally, defaults can be set if property is undefined.
     * 
     * @param filterDefaults
     */
    serialize(filterDefaults: boolean | undefined): IThemesToolConfig;

    /**
     * It returns themes manager.
     */
    getThemesManager(): IMapThemesManager

    /**
     * It sets themes manager.
     * 
     * @param manager 
     */
    setThemesManager(manager: IMapThemesManager): void;

    /**
     * It returns the theme property of the tool state.
     */
    getTheme(): IMapTheme;

    /**
     * It sets the theme property of the tool state.
     * 
     * @param theme 
     */
    setTheme(theme: IMapTheme): void;
}
export default IThemesToolState;