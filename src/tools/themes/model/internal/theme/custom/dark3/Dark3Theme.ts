import IMapTheme from '../../../../types/theme/IMapTheme';
import BasicTheme from '../../basic/BasicTheme';

import './style.scss';

/**
 * This class defines a custom theme.
 * 
 * @author Jiri Hynek
 */
class Dark3Theme extends BasicTheme implements IMapTheme {

    /**
     * It initializes the dark theme.
     */
    public constructor() {
        super();
    }

    /**
     * It returns the theme type.
     */
    public getName(): string {
        return "dark3";
    }

    /**
     * This theme prefers dark colors.
     */
    public isDark(): boolean {
        return true;
    }

    /**
     * It returns the preferred base map.
     */
    public getBaseMap(): string {
        return 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png';
    }
}
export default Dark3Theme;