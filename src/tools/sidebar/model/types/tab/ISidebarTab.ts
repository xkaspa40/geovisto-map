import IMapObject from "../../../../../model/types/object/IMapObject";
import IMapTool from "../../../../../model/types/tool/IMapTool";
import ISidebarTabConfig from "./ISidebarTabConfig";
import ISidebarTabDefaults from "./ISidebarTabDefaults";
import ISidebarTabProps from "./ISidebarTabProps";
import ISidebarTabState from "./ISidebarTabState";

/**
 * This interface declares functions for the sidebar tab.
 * It contains enable button which enables the sidebar and tool.
 *
 * @author Jiri Hynek
 */
interface ISidebarTab extends IMapObject {

    /**
     * It returns the props given by the programmer.
     */
    getProps(): ISidebarTabProps;

    /**
     * It returns default values of the sidebar tab.
     */
    getDefaults(): ISidebarTabDefaults;

    /**
     * It returns the sidebar tab state.
     */
    getState(): ISidebarTabState;

    /**
     * Help function which returns the tool from the state.
     */
    getTool(): IMapTool;

    /**
     * It initializes the sidebar tab.
     * 
     * TODO: define type of sidebar
     *
     * @param {any} sidebar
     * @param {ISidebarTabConfig} config
     */
    initialize(sidebar: any, config: ISidebarTabConfig): void;

    /**
     * Creates sidebar tab.
     */
    create(): void;

    /**
     * It returns the sidebar tab structure defined with respect to the leaflet-sidebar-v2 plug-in.
     *
     * See: https://github.com/noerw/leaflet-sidebar-v2
     *
     * This function can be extended.
     * 
     * TODO: define the return type.
     */
    getTabStructure(): any;

    /**
     * It creates the remaining parts of the sidebar tab after the sidebar tab is rendered.
     */
    postCreate(): any;

    /**
     * It returns tab pane which will be placed in sidebar tab.
     */
    getTabContent(): HTMLElement;

    /**
     * Functions changes layer state to enabled/disabled.
     *
     * @param {boolean} checked
     */
    setChecked(checked: boolean): void;
}
export default ISidebarTab;
