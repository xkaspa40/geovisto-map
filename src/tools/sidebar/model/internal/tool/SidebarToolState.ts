import MapToolState from "../../../../../model/internal/tool/MapToolState";
import ISidebarToolState from "../../types/tool/ISidebarToolState";
import ISidebarTab from "../../types/tab/ISidebarTab";
import ISidebarTool from "../../types/tool/ISidebarTool";
import ISidebarToolConfig from "../../types/tool/ISidebarToolConfig";
import ISidebarTabConfig from "../../types/tab/ISidebarTabConfig";
import { Control } from "leaflet";

/**
 * This class provide sidebar tool model.
 * 
 * @author Jiri Hynek
 */
class SidebarToolState extends MapToolState implements ISidebarToolState {
    
    private tabsConfigs: ISidebarTabConfig[] | undefined;
    
    private tabs: ISidebarTab[];
    
    private sidebar: Control.Sidebar | null;

    /**
     * It creates a tool state.
     */
    constructor(tool: ISidebarTool) {
        super(tool);

        // tabs will be added by using addTab function
        this.tabsConfigs = undefined;
        this.tabs = [];
        this.sidebar = null;
    }

    /**
     * It resets state with respect to initial props.
     */
    public reset(): void {
        super.reset();

        // tabs will be added by using addTab function
        this.tabsConfigs = undefined;
        this.tabs = [];
    }

    /**
     * The metod takes config and deserializes the values.
     * 
     * @param config 
     */
    deserialize(config: ISidebarToolConfig): void {
        super.deserialize(config);

        // original tabs desriptions can be used after all tools are initialized during the sidebar tool creation
        this.tabsConfigs = config.tabs;
    }

    /**
     * The method serializes the tool configuration. Optionally, defaults can be set if property is undefined.
     * 
     * @param filterDefaults
     */
    serialize(filterDefaults: boolean): ISidebarToolConfig {
        const config: ISidebarToolConfig = <ISidebarToolConfig> super.serialize(filterDefaults);

        // serialize sidebar tabs
        config.tabs = [];
        const tabs: ISidebarTab[] = this.getTabs();
        for(let i = 0; i < tabs.length; i++) {
            config.tabs.push(tabs[i].getState().serialize(filterDefaults));
        }

        return config;
    }

    /**
     * It returns the tabs configs.
     */
    public getTabsConfigs(): ISidebarTabConfig[] | undefined {
        return this.tabsConfigs;
    }

    /**
     * It returns the sidebar.
     */
    getSidebar(): Control.Sidebar | null {
        return this.sidebar;
    }

    /**
     * It sets sidebar.
     * 
     * @param sidebar 
     */
    setSidebar(sidebar: Control.Sidebar): void {
        this.sidebar = sidebar;
    }

    /**
     * It returns the tabs controls.
     */
    getTabs(): ISidebarTab[] {
        return this.tabs;
    }

    /**
     * It sets the tabs property of the tool state.
     * 
     * @param tab
     */
    addTab(tab: ISidebarTab): void {
        this.tabs.push(tab);
    }

    /**
     * It removes tab from the list of tabs.
     * 
     * @param tab 
     */
    removeTab(tab: ISidebarTab): void {
        const index = this.tabs.indexOf(tab);
        if (index > -1) {
            this.tabs.splice(index, 1);
        }
    }
}
export default SidebarToolState;