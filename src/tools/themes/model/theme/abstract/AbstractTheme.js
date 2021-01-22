/**
 * This class wraps a filter operation.
 * 
 * @author Jiri Hynek
 */
class AbstractTheme {

    /**
     * It initializes the theme.
     */
    constructor() {
    }

    /**
     * It returns the theme type.
     */
    getType() {
        return "abstract";
    }

    /**
     * It returns the preferred base map.
     * 
     * Override this function.
     */
    getBaseMap() {
        return undefined;
    }

    /**
     * It returns if the styles preferres inversed dark colors.
     * 
     * Override this function.
     */
    isDark() {
        return false;
    }

    // TODO define themes interface
    
}
export default AbstractTheme;