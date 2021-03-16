import IMapTool from '../../../../../model/types/tool/IMapTool';
import ISettingsToolProps from "./ISettingsToolProps";
import ISettingsToolDefaults from "./ISettingsToolDefaults";
import ISettingsToolState from "./ISettingsToolState";

/**
 * This interface represents the settings tool. It provides empty sidebar which can be used be other tools via sidebar fragments.
 * 
 * @author Jiri Hynek
 */
interface ISettingsTool extends IMapTool {

    /**
     * It creates a copy of the uninitialized tool.
     */
    copy(): ISettingsTool;

    /**
     * It returns the props given by the programmer.
     */
    getProps(): ISettingsToolProps;

    /**
     * It returns default values of the state properties.
     */
    getDefaults(): ISettingsToolDefaults;

    /**
     * It returns the sidebar tool state.
     */
    getState(): ISettingsToolState;   
}
export default ISettingsTool;