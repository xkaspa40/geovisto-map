// external libs
import L from 'leaflet';
import "leaflet-sidebar-v2";
import "leaflet-sidebar-v2/css/leaflet-sidebar.min.css";

// styles - TODO: move to index.ts
import "../../../styles/style.scss";

import SidebarToolState from "./SidebarToolState";
import SidebarToolDefaults from "./SidebarToolDefaults";
import ISidebarToolProps from '../../types/tool/ISidebarToolProps';
import ISidebarToolDefaults from '../../types/tool/ISidebarToolDefaults';
import ISidebarToolState from '../../types/tool/ISidebarToolState';
import MapTool from '../../../../../model/internal/tool/MapTool';
import ISidebarTool from '../../types/tool/ISidebarTool';
import ISidebarTab from '../../types/tab/ISidebarTab';
import ISidebarTabConfig from '../../types/tab/ISidebarTabConfig';
import IMapTool from '../../../../../model/types/tool/IMapTool';
import ISidebarTabControl from '../../types/tab/ISidebarTabControl';

/**
 * This class provides the sidebar tool.
 *
 * @author Jiri Hynek
 */
class SidebarTool extends MapTool implements ISidebarTool {

    /**
     * It creates a new tool with respect to the props.
     *
     * @param props
     */
    public constructor(props: ISidebarToolProps | undefined) {
        super(props);
    }

    /**
     * A unique string of the tool type.
     */
    public static TYPE(): string {
        return "geovisto-tool-sidebar";
    }

    /**
     * It creates a copy of the uninitialized tool.
     */
    public copy(): ISidebarTool {
        return new SidebarTool(this.getProps());
    }

    /**
     * It returns the props given by the programmer.
     */
    public getProps(): ISidebarToolProps {
        return <ISidebarToolProps> super.getProps();
    }
    
    /**
     * It returns default values of the sidebar tool.
     */
    public getDefaults(): ISidebarToolDefaults {
        return <ISidebarToolDefaults> super.getDefaults();
    }

    /**
     * It creates new defaults of the tool.
     */
    protected createDefaults(): ISidebarToolDefaults {
        return new SidebarToolDefaults(this);
    }

    /**
     * It returns the sidebar tool state.
     */
    public getState(): ISidebarToolState {
        return <ISidebarToolState> super.getState();
    }

    /**
     * It returns default tool state.
     */
    protected createState(): ISidebarToolState {
        return new SidebarToolState(this);
    }

    /**
     * It creates sidebar.
     */
    public create(): void {
        super.create();
        this.createSidebar();
        this.createTabs();
    }

    /**
     * It creates a sidebar tool and its parts (leaflet sidebar and sidebar tabs).
     */
    protected createSidebar(): void {
        if(this.isEnabled()) {
            let sidebar = undefined;
            // create sidebar control and add it to the map
            sidebar = L.control.sidebar(this.getSidebarStructure()).addTo(this.getMap().getState().getLeafletMap());
            // update state
            this.getState().setSidebar(sidebar);
        }
    }

    /**
     * It returns structure of sidebar defined with respect to the leaflet-sidebar-v2 plugin specification.
     *
     * See: https://github.com/noerw/leaflet-sidebar-v2
     */
    protected getSidebarStructure(): L.Control.SidebarOptions {
        return {
            autopan: false,
            closeButton: true,
            //container: 'sidebar'
            position: 'left',
        };
    }

    /**
     * Help function which returns sidebar tabs.
     */
    public getTabs(): ISidebarTab[] {
        return this.getState().getTabs();
    }

    /**
     * It returns sidebar tabs.
     */
    private createTabs(): void {
        // import tabs
        const tabsConfigs: ISidebarTabConfig[] | undefined = this.getState().getTabsConfigs();
        if(tabsConfigs) {
            // based on config
            let tabConfig: ISidebarTabConfig, tool: IMapTool | undefined;
            for(let i = 0; i < tabsConfigs.length; i++) {
                tabConfig = tabsConfigs[i];
                if(tabConfig.tool) {
                    tool = this.getMap().getState().getTools().getById(tabConfig.tool);
                    this.createSidebarTab(tool, tabConfig);
                }
            }
        } else {
            // based on the implicit order of the tools in the list of the tools
            const tools: IMapTool[] = this.getMap().getState().getTools().getAll();
            for(let i = 0; i < tools.length; i++) {
                this.createSidebarTab(tools[i], undefined);
            }
        }
    }

    /**
     * Help function which tests whether the tool implements
     * getSidebarTab function of the ISidebarTabControl interface.
     * 
     * @param tool 
     */
    private instanceOfTabControl(tool: IMapTool | ISidebarTabControl): tool is ISidebarTabControl {
        return (tool as ISidebarTabControl).getSidebarTab !== undefined;
    }

    /**
     * Help function which initializes and creates sidebar tab for a tool with respect to a given config.
     *
     * @param tool
     * @param config
     */
    private createSidebarTab(tool: IMapTool | undefined, config: ISidebarTabConfig | undefined) {
        if(tool && this.instanceOfTabControl(tool)) {
            const sidebar: L.Control.Sidebar | null = this.getState().getSidebar();
            if(sidebar) {
                // the tool implements the getSidebarTab function
                const sidebarTabControl = tool.getSidebarTab();
                if(sidebarTabControl != undefined) {
                    // render sidebar
                    sidebarTabControl.initialize(sidebar, config);
                    sidebarTabControl.create();
                    // update state
                    this.getState().addTab(sidebarTabControl);
                }
            }
        }
    }
}
export default SidebarTool;
