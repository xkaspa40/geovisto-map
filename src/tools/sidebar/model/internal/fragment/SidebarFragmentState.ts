import MapObjectState from "../../../../../model/internal/object/MapObjectState";
import ISidebarFragment from "../../types/fragment/ISidebarFragment";
import ISidebarFragmentProps from "../../types/fragment/ISidebarFragmentProps";
import IMapTool from "../../../../../model/types/tool/IMapTool";
import ISidebarFragmentDefaults from "../../types/fragment/ISidebarFragmentDefaults";
import ISidebarFragmentState from "../../types/fragment/ISidebarFragmentState";
import ISidebarFragmentConfig from "../../types/fragment/ISidebarFragmentConfig";
import ISidebarTab from "../../types/tab/ISidebarTab";

/**
 * This class manages the state of the sidebar fragment.
 * It wraps the state since the sidebar fragment can work with state objects which needs to be explicitly serialized.
 * 
 * @author Jiri Hynek
 */
class SidebarFragmentState extends MapObjectState implements ISidebarFragmentState {
    
    private tool: IMapTool;
    
    private enabled: boolean;
    
    private sidebarTab: ISidebarTab | null;
    
    private content: HTMLElement | null;

    /**
     * It creates a sidebar fragment state.
     * 
     * @param sidebarFragment 
     */
    constructor(sidebarFragment: ISidebarFragment) {
        super(sidebarFragment);

        const props = <ISidebarFragmentProps> this.getProps();
        const defaults = <ISidebarFragmentDefaults> this.getDefaults();
        
        // store the tool which provides this sidebar fragment
        // props.tool should not be undefined
        this.tool = props.tool;

        this.enabled = props.enabled == undefined ? defaults.isEnabled() : props.enabled;

        this.sidebarTab = null;
        this.content = null;
    }

    /**
     * It resets state with respect to initial props.
     */
    public reset(): void {
        super.reset();

        const props = <ISidebarFragmentProps> this.getProps();
        const defaults = <ISidebarFragmentDefaults> this.getDefaults();

        // set remaining properties if not set
        this.setEnabled(props.enabled == undefined ? defaults.isEnabled() : props.enabled);

        this.sidebarTab = null;
        this.content = null;
    }

    /**
     * The metod takes config and deserializes the values.
     * 
     * @param config 
     */
    public deserialize(config: ISidebarFragmentConfig): void {
        if(config.enabled != undefined) this.setEnabled(config.enabled);
    }

    /**
     * The method serializes the sidebar tab fragment configuration.
     * Optionally, a serialed value can be let undefined if it equals the default value.
     * 
     * @param filterDefaults 
     */
    public serialize(filterDefaults: boolean | undefined): ISidebarFragmentConfig {
        const defaults = <ISidebarFragmentDefaults> this.getDefaults();
        return {
            id: undefined,
            type: undefined,
            tool: this.getTool().getId(),
            enabled: filterDefaults && this.isEnabled() == defaults.isEnabled() ? undefined : this.isEnabled(),
        };
    }

    /**
     * It returns the tool property of the sidebar tab fragment state.
     */
    public getTool(): IMapTool {
        return this.tool;
    }

    /**
     * It sets the tool property of the sidebar tab fragment state.
     * 
     * @param tool 
     */
    public setTool(tool: IMapTool): void {
       this.tool = tool;
    }

    /**
     * It returns the enabled property of the sidebar fragment state.
     */
    public isEnabled(): boolean {
        return this.enabled;
    }

    /**
     * It sets the enabled property of the sidebar fragment state.
     * 
     * @param enabled 
     */
    public setEnabled(enabled: boolean): void {
       this.enabled = enabled;
    }

    /**
     * It returns the sidebar tab property of the sidebar fragment control state.
     */
    public getSidebarTab(): ISidebarTab | null {
        return this.sidebarTab;
    }

    /**
     * It sets the sidebar tab property of the sidebar fragment state.
     * 
     * @param sidebarTab 
     */
    public setSidebarTab(sidebarTab: ISidebarTab): void {
       this.sidebarTab = sidebarTab;
    }

    /**
     * It returns the content property of the sidebar fragment state.
     */
    public getContent(): HTMLElement | null {
        return this.content;
    }

    /**
     * It sets the content property of the sidebar tab control state.
     * 
     * @param content 
     */
    public setContent(content: HTMLElement): void {
       this.content = content;
    }
}
export default SidebarFragmentState;