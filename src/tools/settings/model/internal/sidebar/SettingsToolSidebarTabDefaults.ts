import { SidebarTabDefaults, ISidebarTabDefaults, ISidebarTab } from "../../../../sidebar";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class SettingsToolSidebarTabDefaults extends SidebarTabDefaults implements ISidebarTabDefaults {

    /**
     * It creates tab control defaults.
     */
    constructor(sidebarTab: ISidebarTab) {
        super(sidebarTab);
    }

    /**
     * It returns name of tab pane.
     */
    public getName(): string {
        return "General settings";
    }

    /**
     * It returns the icon of the tab pane.
     */
    public getIcon(): string {
        return '<i class="fa fa-gear"></i>';
    }

    /**
     * The settings tab control does not contain a check button used to enable/disable the tool.
     */
    public getCheckButton(): boolean {
        return false;
    }
}
export default SettingsToolSidebarTabDefaults;