import SettingsTool from "./SettingsTool";
import AbstractToolDefaults from "../../model/tool/abstract/AbstractToolDefaults";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class SettingsToolDefaults extends AbstractToolDefaults {

    /**
     * It creates tool defaults.
     */
    constructor() {
        super();
    }

    /**
     * Only one settings tool should be present in the Geovisto map.
     */
    isSingleton() {
        return true;
    }

    /**
     * It returns a unique string of the tool type.
     */
    getType() {
        return SettingsTool.TYPE();
    }
}
export default SettingsToolDefaults;