import SidebarFragmentState from "./SidebarTabFragmentState";
import SidebarFragmentDefaults from "./SidebarFragmentDefaults";
import ISidebarFragmentDefaults from "../../types/fragment/ISidebarFragmentDefaults";
import MapObject from "../../../../../model/internal/object/MapObject";
import ISidebarFragment from "../../types/fragment/ISidebarFragment";
import ISidebarFragmentProps from "../../types/fragment/ISidebarFragmentProps";
import ISidebarFragmentState from "../../types/fragment/ISidebarFragmentState";
import ISidebarTab from "../../types/tab/ISidebarTab";
import ISidebarFragmentConfig from "../../types/fragment/ISidebarFragmentConfig";

/**
 * This class provides tab fragment for a sidebar tab.
 * 
 * This class is intended to be extended.
 * 
 * @author Jiri Hynek
 */
abstract class AbstractSidebarFragment extends MapObject implements ISidebarFragment {

    /**
     * It creates abstract sidebar fragment with respect to the given props.
     * 
     * @param props 
     */
    constructor(props: ISidebarFragmentProps) {
        super(props);
    }

    /**
     * It returns the props given by the programmer.
     */
    public getProps(): ISidebarFragmentProps {
        return <ISidebarFragmentProps> super.getProps();
    }
    
    /**
     * It returns default values of the sidebar fragment.
     */
    public getDefaults(): ISidebarFragmentDefaults {
        return <ISidebarFragmentDefaults> super.getDefaults();
    }

    /**
     * It creates new defaults of the sidebar fragment.
     */
    protected createDefaults(): ISidebarFragmentDefaults {
        return new SidebarFragmentDefaults(this);
    }

    /**
     * It returns the sidebar fragment state.
     */
    public getState(): ISidebarFragmentState {
        return <ISidebarFragmentState> super.getState();
    }

    /**
     * It creates the sidebar fragment state.
     */
    protected createState(): ISidebarFragmentState {
        return new SidebarFragmentState(this);
    }

    /**
     * The function returns true if the sidebar fragment should be included in the sidebar tab.
     * 
     * @param {ISidebarTab} sidebarTab 
     */
    public abstract isChild(sidebarTab: ISidebarTab): boolean;

    /**
     * It initializes the tab control.
     * 
     * @param {ISidebarTab} tabControl 
     * @param {ISidebarFragmentConfig} config 
     */
    public initialize(tabControl: ISidebarTab, config: ISidebarFragmentConfig | undefined): void {
        // the sidebar tab which stores the sidebar fragment
        // the sidebar tab should not be undefined (this function is called only by tab control)
        this.getState().setSidebarTab(tabControl);

        // copy existing config if exists or use the default one
        this.setConfig(config != undefined ? JSON.parse(JSON.stringify(config)) : this.getDefaults().getConfig());
    }

    /**
     * It returns the HTML content of the sidebar fragment.
     */
    public abstract getContent(): HTMLElement;

    /**
     * This function is called after the sidebar tab is rendered in sidebar.
     */
    public postCreate(): void {
    }

    /**
     * Changes the state of the tool which is controled by this sidebar tab.
     * 
     * @param {boolean} checked 
     */
    public setFragmentContentChecked(checked: boolean) {
    }
}
export default AbstractSidebarFragment;