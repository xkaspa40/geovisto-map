import IMapToolState from "../../../../../model/types/tool/IMapToolState";
import ISidebarToolConfig from "./ISidebarToolConfig";
import ISidebarTab from "../tab/ISidebarTab";
import ISidebarTabConfig from "../tab/ISidebarTabConfig";
import { Control } from "leaflet";

/**
 * This interface declares sidebar tool model.
 * 
 * @author Jiri Hynek
 */
interface ISidebarToolState extends IMapToolState {

    /**
     * The metod takes config and deserializes the values.
     * 
     * @param {ISidebarToolConfig} config 
     */
    deserialize(config: ISidebarToolConfig): void;

    /**
     * The method serializes the tool configuration. Optionally, defaults can be set if property is undefined.
     * 
     * @param {boolean | undefined} filterDefaults
     */
    serialize(filterDefaults: boolean | undefined): ISidebarToolConfig;

    /**
     * It returns the tabs configs.
     */
    getTabsConfigs(): ISidebarTabConfig[] | undefined;

    /**
     * It returns the sidebar.
     */
    getSidebar(): Control.Sidebar | null;

    /**
     * It sets sidebar.
     * 
     * @param {Control.Sidebar} sidebar 
     */
    setSidebar(sidebar: Control.Sidebar): void;

    /**
     * It returns the tabs controls.
     */
    getTabs(): ISidebarTab[];

    /**
     * It sets the tabs property of the tool state.
     * 
     * @param {ISidebarTab} tab
     */
    addTab(tab: ISidebarTab): void;

    /**
     * It removes tab from the list of tabs.
     * 
     * @param {ISidebarTab} tab 
     */
    removeTab(tab: ISidebarTab): void;
}
export default ISidebarToolState;