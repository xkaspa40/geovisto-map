import MapTool from "../../../../../model/internal/tool/MapTool";
import { ISidebarTabControl, ISidebarTab } from "../../../../sidebar";
import ISettingsTool from "../../types/tool/ISettingsTool";
import ISettingsToolProps from "../../types/tool/ISettingsToolProps";
import SettingsToolDefaults from "./SettingsToolDefaults";
import SettingsToolState from "./SettingsToolState";
import SettingsToolSidebarTab from "../sidebar/SettingsToolSidebarTab";
import ISettingsToolState from "../../types/tool/ISettingsToolState";
import ISettingsToolDefaults from "../../types/tool/ISettingsToolDefaults";

/**
 * This class represents settings tools. It provides empty sidebar which can be used be other tools via tab fragments.
 * 
 * @author Jiri Hynek
 */
class SettingsTool extends MapTool implements ISettingsTool, ISidebarTabControl {
    
    /**
     * TODO: to to the state
     */
    private sidebarTab: ISidebarTab | undefined;

    /**
     * It creates a new tool with respect to the props.
     * 
     * @param props 
     */
    constructor(props: ISettingsToolProps) {
        super(props);

        // the tab control for a sidebar will be created only if needed
        this.sidebarTab = undefined;
    }

    /**
     * A unique string of the tool type.
     */
    public static TYPE(): string {
        return "geovisto-tool-settings";
    }

    /**
     * It creates a copy of the uninitialized tool.
     */
    public copy(): ISettingsTool {
        return new SettingsTool(this.getProps());
    }

    /**
     * It returns the props given by the programmer.
     */
    public getProps(): ISettingsToolProps {
        return <ISettingsToolProps> super.getProps();
    }
    
    /**
     * It returns default values of the settings tool.
     */
    public getDefaults(): ISettingsToolDefaults {
        return <ISettingsToolDefaults> super.getDefaults();
    }

    /**
     * It creates new defaults of the tool.
     */
    public createDefaults(): ISettingsToolDefaults {
        return new SettingsToolDefaults(this);
    }

    /**
     * It returns the settings tool state.
     */
    public getState(): ISettingsToolState {
        return <ISettingsToolState> super.getState();
    }

    /**
     * It creates the tool state.
     */
    public createState(): ISettingsToolState {
        return new SettingsToolState(this);
    }

    /**
     * It returns a sidebar tab with respect to the configuration.
     */
    public getSidebarTab(): ISidebarTab {
        if(this.sidebarTab == undefined) {
            this.sidebarTab = this.createSidebarTabControl();
        }
        return this.sidebarTab;
    }

    /**
     * It creates new tab control.
     */
    protected createSidebarTabControl(): ISidebarTab {
        // override if needed
        return new SettingsToolSidebarTab({
            tool: this,
            // defined by the tab defaults
            id: undefined,
            enabled: undefined,
            name: undefined,
            icon: undefined,
            checkButton: undefined
        });
    }
}
export default SettingsTool;