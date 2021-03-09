/**
 * This class provides basic implementation of a theme.
 * 
 * @author Jiri Hynek
 */
class BasicTheme {

    /**
     * It initializes the theme.
     */
    constructor() {
    }

    /**
     * It returns the theme type.
     */
    getType() {
        return "basic";
    }

    /**
     * It returns the preferred base map.
     */
    getBaseMap() {
        return 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
    }

    /**
     * It returns if the styles preferres inversed dark colors.
     */
    isDark() {
        return false;
    }
    
}
export default BasicTheme;