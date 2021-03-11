import { MapObjectState } from "../../../../..";
import ISidebarTabState from "../../types/tab/ISidebarTabState";
import ISidebarTab from "../../types/tab/ISidebarTab";
import ISidebarTabProps from "../../types/tab/ISidebarTabProps";
import ISidebarTabDefaults from "../../types/tab/ISidebarTabDefaults";
import IMapTool from "../../../../../model/types/tool/IMapTool";
import ISidebarFragment from "../../types/fragment/ISidebarFragment";
import ISidebarTabConfig from "../../types/tab/ISidebarTabConfig";
import ISidebarFragmentConfig from "../../types/fragment/ISidebarFragmentConfig";
import ISidebarFragmentControl from "../../types/fragment/ISidebarFragmentControl";
import { Control } from "leaflet";
/**
 * This class manages the state of the sidebar tab.
 * It wraps the state since the sidebar tab can work with state objects which needs to be explicitly serialized.
 * 
 * @author Jiri Hynek
 */
class SidebarTabState extends MapObjectState implements ISidebarTabState {
    
    private tool: IMapTool;
    
    private enabled: boolean;

    private name: string;

    private icon: string;

    private checkButton: boolean;
    
    private sidebar: any | null;
    
    private fragments: ISidebarFragment[] | undefined;
    
    private content: HTMLElement | null;

    /**
     * It creates a sidebar tab state.
     * 
     * @param sidebarTab 
     */
    constructor(sidebarTab: ISidebarTab) {
        super(sidebarTab);

        let props = <ISidebarTabProps> this.getProps();
        let defaults = <ISidebarTabDefaults> this.getDefaults();
        
        // store the tool which provides this sidebar fragment
        // props.tool should not be undefined
        this.tool = props.tool;

        this.enabled = props.enabled == undefined ? defaults.isEnabled() : props.enabled;
        this.name = props.name == undefined ? defaults.getName() : props.name;
        this.icon = props.icon == undefined ? defaults.getIcon() : props.icon;
        this.checkButton = props.checkButton == undefined ? defaults.hasCheckButton() : props.checkButton;

        this.sidebar = null;
        this.fragments = undefined;
        this.content = null;
    }

    /**
     * It resets state with respect to initial props.
     */
    public reset(): void {
        super.reset();
        
        let props = <ISidebarTabProps> this.getProps();
        let defaults = <ISidebarTabDefaults> this.getDefaults();

        // set remaining properties if not set
        this.setName(props.name == undefined ? defaults.getName() : props.name);
        this.setIcon(props.icon == undefined ? defaults.getIcon() : props.icon);
        this.setCheckButton(props.checkButton == undefined ? defaults.hasCheckButton() : props.checkButton);
        this.setEnabled(props.enabled == undefined ? defaults.isEnabled() : props.enabled);

        this.fragments = undefined;
        this.content = null;
    }

    /**
     * The function takes config and deserializes the values.
     * 
     * @param {ISidebarTabConfig} config 
     */
    public deserialize(config: ISidebarTabConfig): void {
        if(config.enabled != undefined) this.setEnabled(config.enabled);
        if(config.name != undefined) this.setName(config.name);
        if(config.icon != undefined) this.setIcon(config.icon);
        if(config.checkButton != undefined) this.setCheckButton(config.checkButton);
    }

    /**
     * The function takes config and deserializes the tab fragments.
     * 
     * @param {ISidebarTabConfig} config 
     */
    protected deserializeFragments(config: ISidebarTabConfig): void {
        // poor JavaScript...
        let instanceOfFragmentControl = function(tool: IMapTool | ISidebarFragmentControl): tool is ISidebarFragmentControl {
            return (tool as ISidebarFragmentControl).getSidebarFragment !== undefined;
        }

        // init help variables
        let fragments: ISidebarFragment[] = [];
        let fragment: ISidebarFragment;
        let tool: IMapTool | undefined;
        let sidebarTab: ISidebarTab = <ISidebarTab> this.getMapObject();

        // process tab fragments
        if(config.fragments) {
            let fragmentConfig: ISidebarFragmentConfig;
            for(let i = 0; i != config.fragments.length; i++) {
                fragmentConfig = config.fragments[i];
                if(fragmentConfig.tool) {
                    tool = this.getTool().getMap().getState().getTools().getById(fragmentConfig.tool);
                    if(tool && (instanceOfFragmentControl(tool))) {
                        fragment = (tool as ISidebarFragmentControl).getSidebarFragment();
                        if(fragment && fragment.isChild(sidebarTab)) {
                            fragment.initialize(sidebarTab, fragmentConfig);
                            fragments.push(fragment);
                        }
                    }
                }
            }
        } else {
            // try to look for fragments if not specified in config
            let tools: IMapTool[] = this.getTool().getMap().getState().getTools().getObjects();
            for(let i = 0; i < tools.length; i++) {
                tool = tools[i];
                if(instanceOfFragmentControl(tool)) {
                    fragment = (tool as ISidebarFragmentControl).getSidebarFragment();
                    if(fragment && fragment.isChild(sidebarTab)) {
                        fragment.initialize(sidebarTab, undefined);
                        fragments.push(fragment);
                    }
                }
            }
        }

        this.setFragments(fragments);
    }

    /**
     * The method serializes the sidebar tab control configuration.
     * Optionally, a serialed value can be let undefined if it equals the default value.
     * 
     * @param {boolean | undefined} defaults 
     */
    public serialize(filterDefaults: boolean | undefined): ISidebarTabConfig {
        // do not serialize id and type - it is not necessary for deserialization

        let defaults = <ISidebarTabDefaults> this.getDefaults();

        let config: ISidebarTabConfig = {
            type: undefined,
            id: undefined,
            tool: this.getTool().getId(),
            enabled: filterDefaults && this.isEnabled() == defaults.isEnabled() ? undefined : this.isEnabled(),
            name: filterDefaults && this.getName() == defaults.getName() ? undefined : this.getName(),
            icon: filterDefaults && this.getIcon() == defaults.getIcon() ? undefined : this.getIcon(),
            checkButton: filterDefaults && this.hasCheckButton() == defaults.isEnabled() ? undefined : this.hasCheckButton(),
            fragments: undefined
        };

        // serialize tab fragments
        let fragments : ISidebarFragment[] | undefined = this.getFragments();
        if(fragments) {
            config.fragments = [];
            for(let i = 0; i != fragments.length; i++) {
                config.fragments.push(fragments[i].getState().serialize(true));
            }
        }

        return config;
    }

    /**
     * It returns the tool property of the sidebar tab state.
     */
    public getTool(): IMapTool {
        return this.tool;
    }

    /**
     * It sets the tool property of the sidebar tab state.
     * 
     * @param {IMapTool} tool 
     */
    public setTool(tool: IMapTool): void {
       this.tool = tool;
    }

    /**
     * It returns the enabled property of the sidebar tab state.
     */
    public isEnabled(): boolean {
        return this.enabled;
    }

    /**
     * It sets the enabled property of the sidebar tab state.
     * 
     * @param {boolean} enabled 
     */
    public setEnabled(enabled: boolean): void {
       this.enabled = enabled;
    }

    /**
     * It returns the name property of the sidebar tab state.
     */
    public getName(): string {
        return this.name;
    }

    /**
     * It sets the name property of the sidebar tab state.
     * 
     * @param {string} name 
     */
    public setName(name: string): void {
       this.name = name;
    }

    /**
     * It returns the icon property of the sidebar tab state.
     */
    public getIcon(): string {
        return this.icon;
    }

    /**
     * It sets the icon property of the sidebar tab state.
     * 
     * @param {string} icon
     */
    public setIcon(icon: string): void {
       this.icon = icon;
    }

    /**
     * It returns the checkButton property of the sidebar tab state.
     */
    public hasCheckButton(): boolean {
        return this.checkButton;
    }

    /**
     * It sets the checkButton property of the sidebar tab state.
     * 
     * @param {boolean} checkButton 
     */
    public setCheckButton(checkButton: boolean): void {
       this.checkButton = checkButton;
    }

    /**
     * It returns the sidebar property of the sidebar tab state.
     */
    public getSidebar(): Control.Sidebar | null {
        return this.sidebar;
    }

    /**
     * It sets the sidebar property of the sidebar tab state.
     * 
     * @param {Control.Sidebar} sidebar 
     */
    public setSidebar(sidebar: Control.Sidebar): void {
        this.sidebar = (this.sidebar == undefined) ? sidebar : this.sidebar;
    }

    /**
     * It returns the HTML content property of the sidebar tab state.
     */
    public getContent(): HTMLElement | null {
        return this.content;
    }

    /**
     * It sets the HTML content property of the sidebar tab state.
     * 
     * @param {HTMLElement} content 
     */
    public setContent(content: HTMLElement): void {
       this.content = content;
    }

    /**
     * It returns the fragments property of the sidebar tab state.
     */
    public getFragments(): ISidebarFragment[] | undefined {
        return this.fragments;
    }

    /**
     * It sets the fragments property of the sidebar tab state.
     * 
     * @param {*} fragments 
     */
    public setFragments(fragments: ISidebarFragment[]): void {
        this.fragments = fragments;
    }
}
export default SidebarTabState;