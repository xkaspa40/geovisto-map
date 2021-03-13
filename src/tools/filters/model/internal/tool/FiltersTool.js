import AbstractTool from "../../model/tool/abstract/AbstractTool";
import FiltersToolTabControl from "../sidebar/FiltersToolTabControl";
import FiltersToolDefaults from "./FiltersToolDefaults";
import FiltersToolState from "./FiltersToolState";

/**
 * This class wraps filters, sidebar tab and state. It provides methods for filters management.
 * 
 * @author Jiri Hynek
 */
class FiltersTool extends AbstractTool {

    /**
     * It creates a new tool with respect to the props.
     * 
     * @param props 
     */
    constructor(props) {
        super(props);

        // the tab control for a sidebar will be created only if needed
        this.tabControl = undefined;
    }

    /**
     * A unique string of the tool type.
     */
    static TYPE() {
        return "geovisto-tool-filters";
    }

    /**
     * It creates a copy of the uninitialized tool.
     */
    copy() {
        return new FiltersTool(this.getProps());
    }

    /**
     * It creates new defaults of the tool.
     */
    createDefaults() {
        return new FiltersToolDefaults();
    }

    /**
     * It returns default tool state.
     */
    createState() {
        return new FiltersToolState();
    }

    /**
     * It creates new filter tool.
     */
    create() {
        // set filter rules
        this.setFilterRules(this.getState().getFilterRules());
    }

    /**
     * It returns a tab control.
     */
    getSidebarTabControl() {
        if(this.tabControl == undefined) {
            this.tabControl = this.createSidebarTabControl();
        }
        return this.tabControl;
    }

    /**
     * It creates new tab control.
     */
    createSidebarTabControl() {
        return new FiltersToolTabControl({ tool: this });
    }

    /**
     * 
     * @param filterRules 
     */
    setFilterRules(filterRules) {
        if(filterRules != undefined) {
            // if the filter tool is enabled, update map data
            if(this.isEnabled()) {
                let mapData = this.getMap().getState().getMapData();
                this.getMap().updateData(this.getState().getFiltersManager().filterData(mapData, mapData.getData(), filterRules));
            }

            // update filter rules
            this.getState().setFilterRules(filterRules);
        }
    }

    /**
     * It changes filters state to enabled/disabled.
     * 
     * @param enabled
     */
    setEnabled(enabled) {
        if(enabled != this.isEnabled()) {
            // update state
            this.getState().setEnabled(enabled);

            // the Geovisto map stores the current data and works as the event dispatcher
            let map = this.getMap();

            // apply filter rules if enabled, else use empty list of filters (use the initial data)
            if(enabled) {
                let mapData = this.getMap().getState().getMapData();
                map.updateData(this.getState().getFiltersManager().filterData(mapData, mapData.getData(), this.getState().getFilterRules()));
            } else {
                map.updateData(map.getState().getMapData().getData());
            }
        }
    }
}
export default FiltersTool;