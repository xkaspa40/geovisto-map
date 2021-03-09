import AbstractThemesManager from "../abstract/AbstractThemesManager";

/**
 * This class provide functions for using themes.
 * 
 * @author Jiri Hynek
 */
class ThemesManager extends AbstractThemesManager {

    constructor(themes) {
        super();
        this.themes = themes;
    }

    /**
     * The function returns available themes.
     */
    getThemes() {
        return this.themes;
    }

    /**
     * The function returns the default theme.
     */
    getDefault() {
        let objects = this.getThemes();
        return objects && objects.length > 0 ? objects[0] : undefined;
    }
}
export default ThemesManager;