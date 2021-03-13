import * as d3 from "d3";
import MapObject from "../../../../../model/internal/object/MapObject";
import ISidebarTab from "../../types/tab/ISidebarTab";
import ISidebarTabProps from "../../types/tab/ISidebarTabProps";
import ISidebarTabDefaults from "../../types/tab/ISidebarTabDefaults";
import SidebarTabDefaults from "./SidebarTabDefaults";
import ISidebarTabState from "../../types/tab/ISidebarTabState";
import SidebarTabState from "./SidebarTabState";
import ISidebarTabConfig from "../../types/tab/ISidebarTabConfig";
import IMapTool from "../../../../../model/types/tool/IMapTool";
import ISidebarFragment from "../../types/fragment/ISidebarFragment";
import { Control } from "leaflet";

const C_sidebar_header_class = "leaflet-sidebar-header";
const C_sidebar_tab_content_class = "leaflet-sidebar-tab-content";
const C_enabled_class = "enabled";
const C_checked_class = "checked";

/**
 * This class provides controls for a sidebar tab.
 * It contains enable button which enables the sidebar and tool.
 *
 * This class is intended to be extended.
 *
 * @author Jiri Hynek
 */
abstract class AbstractSidebarTab extends MapObject implements ISidebarTab {

    /**
     * It creates abstract sidebar tab with respect to the given props.
     * 
     * @param props 
     */
    constructor(props: ISidebarTabProps) {
        super(props);
    }

    /**
     * It returns the props given by the programmer.
     */
    public getProps(): ISidebarTabProps {
        return <ISidebarTabProps> super.getProps();
    }
    
    /**
     * It returns default values of the sidebar tab.
     */
    public getDefaults(): ISidebarTabDefaults {
        return <ISidebarTabDefaults> super.getDefaults();
    }

    /**
     * It creates new defaults of the sidebar tab.
     */
    protected createDefaults(): ISidebarTabDefaults {
        return <ISidebarTabDefaults> new SidebarTabDefaults(this);
    }

    /**
     * It returns the sidebar tab state.
     */
    public getState(): ISidebarTabState {
        return <ISidebarTabState> super.getState();
    }

    /**
     * It creates the sidebar tab state.
     */
    protected createState(): ISidebarTabState {
        return <ISidebarTabState> new SidebarTabState(this);
    }

    /**
     * Help function which returns the tool.
     */
    public getTool(): IMapTool {
        return this.getState().getTool();
    }

    /**
     * Help function which returns sidebar fragmnets.
     */
    public getFragments(): ISidebarFragment[] | undefined {
        return this.getState().getFragments();
    }

    /**
     * It initializes the sidebar tab.
     *
     * @param sidebar
     * @param config
     */
    public initialize(sidebar: Control.Sidebar, config: ISidebarTabConfig): void {
        // the sidebar which stores the tab
        // the sidebar should not be undefined (this function is called only by sidebar)
        this.getState().setSidebar(sidebar);

        // copy existing config if exists or use the default one
        this.setConfig(config != undefined ? JSON.parse(JSON.stringify(config)) : this.getDefaults().getConfig());
    }

    /**
     * Creates sidebar tab.
     *
     */
    public create(): void {
        const state: ISidebarTabState = this.getState();
        const sidebar: Control.Sidebar | null = state.getSidebar();
        if(sidebar && state.isEnabled()) {
            // render sidebar tab pane
            sidebar.addPanel(this.getTabStructure());

            // arrange DOM elements after they are rendered
            this.postCreate();
        }
    }

    /**
     * It returns the sidebar tab structure defined with respect to the leaflet-sidebar-v2 plug-in.
     *
     * See: https://github.com/noerw/leaflet-sidebar-v2
     */
    protected getTabStructure(): Control.PanelOptions {
        return {
            id: this.getState().getId(),
            tab: this.getState().getIcon(),
            // the content of the pane needs to added after the render since it can contain event listeners
            pane: '<div class="' + C_sidebar_tab_content_class + '"></div>',
            title: ' ' + this.getState().getName(),
            position: 'top'
        };
    }

    /**
     * It creates the remaining parts of the sidebar tab after the sidebar tab is rendered.
     */
    protected postCreate(): void {
        // get rendered sidebar tab
        const tabElement: HTMLElement | null = document.getElementById(this.getState().getId());

        // create sidebar tab content
        if(tabElement) {
            const tabContentElements: HTMLCollectionOf<Element> = tabElement.getElementsByClassName(C_sidebar_tab_content_class);
            if(tabContentElements.length > 0) {
                const tabContent: Element = tabContentElements[0];
                tabContent.appendChild(this.getContent());

                // append tab fragments if defined
                const tabFragments: ISidebarFragment[] | undefined = this.getState().getFragments();
                if(tabFragments) {
                    for(let i = 0; i < tabFragments.length; i++) {
                        tabContent.appendChild(tabFragments[i].getContent());
                    }
                }

                // enable/disable button
                const tabHeaderElements: HTMLCollectionOf<Element> = tabElement.getElementsByClassName(C_sidebar_header_class);
                if(tabHeaderElements.length > 0) {
                    const tabHeader: Element = tabHeaderElements[0];
                    
                    // check button
                    if(this.getState().hasCheckButton()) {
                        // create enable button in sidebar tab header
                        const tabEnableBtn: HTMLInputElement = document.createElement("input");
                        tabEnableBtn.setAttribute("type", "checkbox");
                        tabEnableBtn.setAttribute("id", this.getState().getId() + '-enable-btn');
                        var _this = this;
                        tabEnableBtn.onclick = function() {
                            // onclick event handler enables/disables its items
                            _this.setChecked(tabEnableBtn.checked);
                        };
                        tabHeader.insertBefore(tabEnableBtn, tabHeader.firstChild);

                        if(this.getState().getTool().isEnabled()) {
                            tabEnableBtn.setAttribute(C_checked_class, "true");
                        }
                    }

                    // initial state
                    if(this.getState().getTool().isEnabled()) {
                        tabHeader.classList.add(C_enabled_class);
                        tabElement.classList.add(C_enabled_class);
                    } else {
                        // disable inputs
                        d3.select(tabContent).selectAll("input").attr("disabled", "true");
                        d3.select(tabContent).selectAll("select").attr("disabled", "true");
                        d3.select(tabContent).selectAll("button").attr("disabled", "true");
                    }
                }
            }
        }
    }

    /**
     * It returns tab pane which will be placed in sidebar tab.
     *
     * This function needs to be extended.
     */
    protected abstract getContent(): HTMLElement;

    /**
     * Functions changes layer state to enabled/disabled.
     *
     * @param checked
     */
    public setChecked(checked: boolean): void {
        const tool: IMapTool = this.getState().getTool();
        if(checked != tool.isEnabled()) {
            // enable/disable sidebar tab
            const sidebarTab = d3.select("#" + this.getState().getId());
            if(sidebarTab != undefined) {
                // emhasize tab
                sidebarTab.classed(C_enabled_class, checked);
                sidebarTab.select("." + C_sidebar_header_class).classed(C_enabled_class, checked);
                // enable sidebar inputs
                sidebarTab.select("." + C_sidebar_tab_content_class).selectAll("input").attr("disabled", checked ? "false" : "true");
                sidebarTab.select("." + C_sidebar_tab_content_class).selectAll("select").attr("disabled", checked ? "false" : "true");
                sidebarTab.select("." + C_sidebar_tab_content_class).selectAll("button").attr("disabled", checked ? "false" : "true");
            }

            // switch state
            this.setTabContentChecked(checked);

            // update the tool state
            tool.setEnabled(checked);
        }
    }

    /**
     * Changes the state of the tool which is controled by this sidebar tab.
     *
     * This function can be extended if needed.
     *
     * @param checked
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    public setTabContentChecked(checked: boolean): void {
    }
}
export default AbstractSidebarTab;
