import AbstractMapDomain from "../../../../../../model/internal/domain/abstract/AbstractMapDomain";
import IMapTheme from "../../../types/theme/IMapTheme";

/**
 * This class provides basic implementation of a theme.
 * 
 * @author Jiri Hynek
 */
class BasicTheme extends AbstractMapDomain implements IMapTheme {

    /**
     * It initializes the theme.
     */
    public constructor() {
        super();
    }

    /**
     * It returns the theme type.
     */
    public getName(): string {
        return "basic";
    }

    /**
     * It returns the preferred base map.
     */
    public getBaseMap(): string {
        return 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
    }

    /**
     * It returns if the styles preferres inversed dark colors.
     */
    public isDark(): boolean {
        return false;
    }
    
}
export default BasicTheme;