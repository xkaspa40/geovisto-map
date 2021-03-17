import { AbstractSidebarTab, ISidebarTab, ISidebarTabDefaults } from "../../../../sidebar";
import ILayerToolSidebarTabProps from "../../../../sidebar/model/types/tab/ISidebarTabProps";
import SettingsToolSidebarTabDefaults from "./SettingsToolSidebarTabDefaults";
import ISettingsTool from "../../types/tool/ISettingsTool";

/**
 * This class provides the settings sidebar tab.
 * 
 * @author Jiri Hynek
 */
class SettingsToolSidebarTab extends AbstractSidebarTab<ISettingsTool> implements ISidebarTab {
    
    private htmlContent: HTMLElement | undefined;

    /**
     * It creates a sidebar tab with respect to the given props.
     * 
     * @param tool
     * @param props 
     */
    public constructor(tool: ISettingsTool, props: ILayerToolSidebarTabProps | undefined) {
        super(tool, props);
    }

    /**
     * It creates new defaults of the sidebar tab.
     */
    protected createDefaults(): ISidebarTabDefaults {
        return new SettingsToolSidebarTabDefaults(this);
    }

    /**
     * It returns generic layer tab pane.
     */
    protected getContent(): HTMLElement {
        if(this.htmlContent == undefined) {
            // tab pane contains empty div element
            this.htmlContent = document.createElement('div');

            // it provides empty tab - tab fragments can be appended
        }

        return this.htmlContent; 
    }

}
export default SettingsToolSidebarTab;