import IMapObjectState from "../../../../../model/types/object/IMapObjectState";
import ISidebarTabConfig from "./ISidebarTabConfig";
import IMapTool from "../../../../../model/types/tool/IMapTool";
import ISidebarFragment from "../fragment/ISidebarFragment";

/**
 * This interface declares the state of the sidebar tab.
 * It wraps the state since the sidebar tab can work with state objects which needs to be explicitly serialized.
 * 
 * @author Jiri Hynek
 */
interface ISidebarTabState extends IMapObjectState {

    /**
     * The function takes config and deserializes the values.
     * 
     * @param {ISidebarTabConfig} config 
     */
    deserialize(config: ISidebarTabConfig): void;

    /**
     * The method serializes the sidebar tab configuration.
     * Optionally, a serialed value can be let undefined if it equals the default value.
     * 
     * @param {boolean} filterDefaults 
     */
    serialize(filterDefaults: boolean): ISidebarTabConfig;

    /**
     * It returns the tool property of the sidebar tab state.
     */
    getTool(): IMapTool;

    /**
     * It sets the tool property of the sidebar tab state.
     * 
     * @param {IMapTool} tool 
     */
    setTool(tool: IMapTool): void;

    /**
     * It returns the enabled property of the sidebar tab state.
     */
    isEnabled(): boolean;

    /**
     * It sets the enabled property of the sidebar tab state.
     * 
     * @param {boolean} enabled 
     */
    setEnabled(enabled: boolean): void;

    /**
     * It returns the name property of the sidebar tab state.
     */
    getName(): string;

    /**
     * It sets the name property of the sidebar tab state.
     * 
     * @param {string} name 
     */
    setName(name: string): void;

    /**
     * It returns the icon property of the sidebar tab state.
     */
    getIcon(): string

    /**
     * It sets the icon property of the sidebar tab state.
     * 
     * @param {string} icon
     */
    setIcon(icon: string): void;

    /**
     * It returns the checkButton property of the sidebar tab state.
     */
    hasCheckButton(): boolean;

    /**
     * It sets the checkButton property of the sidebar tab state.
     * 
     * @param {boolean} checkButton 
     */
    setCheckButton(checkButton: boolean): void;

    /**
     * It returns the sidebar property of the sidebar tab state.
     * 
     * TODO: set type
     */
    getSidebar(): any;

    /**
     * It sets the sidebar property of the sidebar tab state.
     * 
     * TODO: set type
     * 
     * @param {any} sidebar 
     */
    setSidebar(sidebar: any): void;

    /**
     * It returns the tabPane property of the sidebar tab state.
     */
    getTabPane(): HTMLElement;

    /**
     * It sets the tabPane property of the sidebar tab state.
     * 
     * @param {HTMLElement} tabPane 
     */
    setTabPane(tabPane: HTMLElement): void;

    /**
     * It returns the fragments property of the tool state.
     */
    getTabFragments(): ISidebarFragment[];

    /**
     * It sets the fragments property of the tool state.
     * 
     * @param {ISidebarFragment[]} fragments 
     */
    setTabFragments(fragments: ISidebarFragment[]): void;
}
export default ISidebarTabState;