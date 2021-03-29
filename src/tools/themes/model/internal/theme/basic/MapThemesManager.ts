import MapDomainArrayManager from "../../../../../../model/internal/domain/generic/MapDomainArrayManager";
import IMapTheme from "../../../types/theme/IMapTheme";
import IMapThemesManager from "../../../types/theme/IMapThemesManager";

/**
 * This class provide functions for using themes.
 * 
 * @author Jiri Hynek
 */
class MapThemesManager extends MapDomainArrayManager<IMapTheme> implements IMapThemesManager {

    public constructor(themes: IMapTheme[]) {
        super(themes);
    }

    /**
     * The function returns the default theme.
     */
    public getDefault(): IMapTheme | undefined {
        const objects: IMapTheme[] = this.getDomains();
        return objects && objects.length > 0 ? objects[0] : undefined;
    }
}
export default MapThemesManager;