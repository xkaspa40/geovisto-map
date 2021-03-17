import IMapObject from "../../../../../model/types/object/IMapObject";
import IMapTool from "../../../../../model/types/tool/IMapTool";
import ISidebarTabConfig from "./ISidebarTabConfig";
import ISidebarTabDefaults from "./ISidebarTabDefaults";
import ILayerToolSidebarTabProps from "./ISidebarTabProps";
import ISidebarTabState from "./ISidebarTabState";
import { Control } from "leaflet";
import ISidebarFragment from "../fragment/ISidebarFragment";

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
    getProps(): ILayerToolSidebarTabProps;

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
     * @param sidebar
     * @param config
     */
    initialize(sidebar: Control.Sidebar, config: ISidebarTabConfig | undefined): void;

    /**
     * Creates sidebar tab.
     */
    create(): void;

    /**
     * Functions changes layer state to enabled/disabled.
     *
     * @param checked
     */
    setChecked(checked: boolean): void;

    /**
     * It returns the fragments property of the sidebar tab state.
     */
    getFragments(): ISidebarFragment[] | undefined;
}
export default ISidebarTab;