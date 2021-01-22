import AbstractTheme from '../../abstract/AbstractTheme';

import './style.scss';

/**
 * This class wraps a filter operation.
 * 
 * @author Jiri Hynek
 */
class Light3Theme extends AbstractTheme {

    /**
     * It initializes the light theme.
     */
    constructor() {
        super();
    }

    /**
     * It returns the theme type.
     */
    getType() {
        return "light3";
    }

    /**
     * It returns the preferred base map.
     */
    getBaseMap() {
        return 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
    }
}
export default Light3Theme;