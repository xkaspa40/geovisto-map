/**
 * This class provide functions for using themes.
 * 
 * @author Jiri Hynek
 */ 
class AbstractThemesManager {

    /**
     * It initializes the theme manager.
     */
    constructor() {
    }

    /**
     * It returns available filter operations
     */
    getThemes() {
        return [];
    }

    /**
     * It returns available filter operations
     */
    getTheme(label) {
        let themes = this.getThemes();
        let resultObjects = [];
        if(themes != undefined) {
            for(let i = 0; i < themes.length; i++) {
                if(themes[i].getType() == label) {
                    resultObjects.push(themes[i]);
                }
            }
        }
        return resultObjects;
    }

    /**
     * The function returns available theme types.
     */
    getThemeLabels() {
        let labels = [];
        let themes = this.getThemes();
        if(themes != undefined) {
            for(let i = 0; i < themes.length; i++) {
                labels.push(themes[i].getType());
            }
        }
        return labels;
    }

    /**
     * It returns the default theme.
     */
    getDefault() {
        return undefined;
    }
    
}
export default AbstractThemesManager;