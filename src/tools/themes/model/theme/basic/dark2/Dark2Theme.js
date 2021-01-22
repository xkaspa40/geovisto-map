import AbstractTheme from '../../abstract/AbstractTheme';

import './style.scss';

/**
 * This class wraps a filter operation.
 * 
 * @author Jiri Hynek
 */
class Dark2Theme extends AbstractTheme {

    /**
     * It initializes the dark theme.
     */
    constructor() {
        super();
    }

    /**
     * It returns the theme type.
     */
    getType() {
        return "dark2";
    }

    /**
     * This theme prefers dark colors.
     */
    isDark() {
        return true;
    }

    /**
     * It returns the preferred base map.
     */
    getBaseMap() {
        return 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png';
    }
}
export default Dark2Theme;