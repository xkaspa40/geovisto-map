import ThemesManager from "./model/theme/generic/ThemesManager";
import Light1Theme from "./model/theme/basic/light1/Light1Theme";
import Light2Theme from "./model/theme/basic/light2/Light2Theme";
import Light3Theme from "./model/theme/basic/light3/Light3Theme";
import Dark1Theme from "./model/theme/basic/dark1/Dark1Theme";
import Dark2Theme from "./model/theme/basic/dark2/Dark2Theme";
import Dark3Theme from "./model/theme/basic/dark3/Dark3Theme";
import ThemesTool from "./ThemesTool";
import AbstractToolDefaults from "../../model/tool/abstract/AbstractToolDefaults";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class ThemesToolDefaults extends AbstractToolDefaults {

    /**
     * It creates tool defaults.
     */
    constructor() {
        super();
    }

    /**
     * Only one themes tool should be present in the Geovisto map.
     */
    isSingleton() {
       return true; 
    }

    /**
     * It returns a unique string of the tool type.
     */
    getType() {
        return ThemesTool.TYPE();
    }

    /**
     * It returns default themes manager.
     */
    getThemesManager() {
        return new ThemesManager([
            new Light1Theme(),
            new Light2Theme(),
            new Light3Theme(),
            new Dark1Theme(),
            new Dark2Theme(),
            new Dark3Theme()
        ]);
    }

    /**
     * It returns default theme.
     */
    getTheme() {
        return this.getMapObject().getState().getThemesManager().getDefault();
    }
}
export default ThemesToolDefaults;