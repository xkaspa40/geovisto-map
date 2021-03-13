import MapCategoriesManager from "../../../../../../model/internal/category/generic/MapCategoriesManager";
import IMapTheme from "../../../types/theme/IMapTheme";
import IMapThemesManager from "../../../types/theme/IMapThemesManager";

/**
 * This class provide functions for using themes.
 * 
 * @author Jiri Hynek
 */
class MapThemesManager extends MapCategoriesManager<IMapTheme> implements IMapThemesManager {

    constructor(themes: IMapTheme[]) {
        super(themes);
    }

    /**
     * The function returns the default theme.
     */
    getDefault(): IMapTheme | undefined {
        const objects: IMapTheme[] = this.getAll();
        return objects && objects.length > 0 ? objects[0] : undefined;
    }
}
export default MapThemesManager;