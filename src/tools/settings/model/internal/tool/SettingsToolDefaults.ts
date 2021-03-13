import MapToolDefaults from "../../../../../model/internal/tool/MapToolDefaults";
import ISettingsToolDefaults from "../../types/tool/ISettingsToolDefaults";
import ISettingsTool from "../../types/tool/ISettingsTool";
import SettingsTool from "./SettingsTool";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class SettingsToolDefaults extends MapToolDefaults implements ISettingsToolDefaults {

    /**
     * It creates tool defaults.
     */
    constructor(tool: ISettingsTool) {
        super(tool);
    }

    /**
     * Only one settings tool should be present in the Geovisto map.
     */
    public isSingleton(): boolean {
       return true; 
    }

    /**
     * It returns a unique string of the tool type.
     */
    public getType(): string {
        return SettingsTool.TYPE();
    }
}
export default SettingsToolDefaults;