import AbstractTool from '../../model/tool/abstract/AbstractTool';
import SettingsToolTabControl from "./sidebar/SettingsToolTabControl";
import SettingsToolDefaults from './SettingsToolDefaults';
import SettingsToolState from './SettingsToolState';

/**
 * This class represents settings tools. It provides empty sidebar which can be used be other tools via tab fragments.
 * 
 * TODO: exclude defaults and state variables
 * 
 * @author Jiri Hynek
 */
class SettingsTool extends AbstractTool {

    /**
     * It creates a new tool with respect to the props.
     * 
     * @param {*} props 
     */
    constructor(props) {
        super(props);

        console.log("create settings tool");
        // the tab control for a sidebar will be created only if needed
        this.tabControl = undefined;
    }

    /**
     * A unique string of the tool type.
     */
    static TYPE() {
        return "geovisto-tool-settings";
    }

    /**
     * It creates a copy of the uninitialized tool.
     */
    copy() {
        return new SettingsTool(this.getProps());
    }

    /**
     * It creates new defaults of the tool.
     */
    createDefaults() {
        return new SettingsToolDefaults();
    }

    /**
     * It creates the tool state.
     */
    createState() {
        return new SettingsToolState();
    }

    /**
     * It returns tab control with respect to the configuration.
     */
    getSidebarTabControl() {
        if (this.tabControl == undefined) {
            this.tabControl = this.createSidebarTabControl();
        }
        return this.tabControl;
    }

    /**
     * It creates new tab control.
     * 
     * This function can be extended.
     */
    createSidebarTabControl() {
        return new SettingsToolTabControl({ tool: this });
    }
}
export default SettingsTool;