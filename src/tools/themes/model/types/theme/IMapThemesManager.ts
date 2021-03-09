import IMapTheme from "./IMapTheme";
import IMapCategoriesManager from "../../../../../model/types/category/IMapCategoriesManager";

/**
 * This interface declares a manager for using themes.
 * 
 * @author Jiri Hynek
 */
interface IMapThemesManager extends IMapCategoriesManager {

    /**
     * It returns the default theme.
     */
    getDefault(): IMapTheme;
    
}
export default IMapThemesManager;