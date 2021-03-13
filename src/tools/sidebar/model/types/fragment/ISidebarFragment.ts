import ISidebarFragmentDefaults from "./ISidebarFragmentDefaults";
import IMapObject from "../../../../../model/types/object/IMapObject";
import ISidebarFragmentProps from "./ISidebarFragmentProps";
import ISidebarFragmentState from "./ISidebarFragmentState";
import ISidebarTab from "../tab/ISidebarTab";
import ISidebarFragmentConfig from "./ISidebarFragmentConfig";

/**
 * This interface declares a sidebar fragment for a sidebar tab.
 * 
 * @author Jiri Hynek
 */
interface ISidebarFragment extends IMapObject {

    /**
     * It returns the props given by the programmer.
     */
    getProps(): ISidebarFragmentProps;

    /**
     * It returns default values of the sidebar fragment.
     */
    getDefaults(): ISidebarFragmentDefaults;

    /**
     * It returns the sidebar fragment state.
     */
    getState(): ISidebarFragmentState;

    /**
     * The function returns true if the sidebar fragment should be included in the sidebar tab.
     * 
     * @param sidebarTab 
     */
    isChild(sidebarTab: ISidebarTab): boolean

    /**
     * It initializes the sidebar fragment.
     * 
     * @param sidebarTab 
     * @param config 
     */
    initialize(sidebarTab: ISidebarTab, config: ISidebarFragmentConfig | undefined): void;

    /**
     * It returns the HTML content of the sidebar fragment.
     */
    getContent(): HTMLElement;

    /**
     * This function is called after the sidebar tab is rendered in sidebar.
     */
    postCreate(): void

    /**
     * Changes the state of the tool which is controled by this sidebar tab.
     * 
     * @param checked 
     */
    setFragmentContentChecked(checked: boolean): void;

}
export default ISidebarFragment;