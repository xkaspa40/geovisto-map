import * as d3 from "d3";
import AbstractMapObject from "../../../../model/object/generic/AbstractMapObject";
import AbstractTabControlState from "./AbstractTabControlState";
import AbstractTabControlDefaults from "./AbstractTabControlDefaults";

const C_sidebar_header_class = "leaflet-sidebar-header";
const C_sidebar_tab_content_class = "leaflet-sidebar-tab-content";
const C_enabled_class = "enabled";
const C_checked_class = "checked";

/**
 * This class provides controls for sidebar tabs.
 * It contains enable button which enables the sidebar and tool.
 *
 * This class is intended to be extended.
 *
 * @author Jiri Hynek
 */
class AbstractTabControl extends AbstractMapObject {

    constructor(props) {
        super(props);
    }

    /**
     * It creates new defaults of the tab control.
     */
    createDefaults() {
        return new AbstractTabControlDefaults();
    }

    /**
     * It creates the tab control state.
     */
    createState() {
        return new AbstractTabControlState();
    }

    /**
     * Help function which returns the tool.
     */
    getTool() {
        return this.getState().getTool();
    }

    /**
     * It initializes the tab control.
     *
     * @param {*} sidebar
     * @param {*} config
     */
    initialize(sidebar, config) {
        // the sidebar which stores the tab
        // the sidebar should not be undefined (this function is called only by sidebar)
        this.getState().setSidebar(sidebar);

        // copy existing config if exists or use the default one
        this.getState().deserialize(this, config != undefined ? JSON.parse(JSON.stringify(config)) : this.getDefaults().getConfig());

        return this;
    }

    /**
     * Creates sidebar tab.
     *
     */
    create() {
        let state = this.getState();
        if(state.getSidebar() != undefined && state.isEnabled()) {
            // render sidebar tab pane
            state.getSidebar().addPanel(this.getTabStructure());

            // arrange DOM elements after they are rendered
            this.postCreate();
        }
        return this;
    }

    /**
     * It returns the sidebar tab structure defined with respect to the leaflet-sidebar-v2 plug-in.
     *
     * See: https://github.com/noerw/leaflet-sidebar-v2
     *
     * This function can be extended.
     */
    getTabStructure() {
        return {
            id: this.getState().getId(),
            tab: this.getState().getIcon(),
            // the content of the pane needs to added after the render since it can contain event listeners
            pane: '<div class="' + C_sidebar_tab_content_class + '"></div>',
            title: ' ' + this.getState().getName(),
            position: 'top'
        };
    }

    postCreate() {
        // get rendered sidebar tab
        let tabElement = document.getElementById(this.getState().getId());

        // create sidebar tab content
        let tabContent = tabElement.getElementsByClassName(C_sidebar_tab_content_class)[0];
        tabContent.appendChild(this.getTabContent());

        // append tab fragments if defined
        let tabFragments = this.getState().getTabFragments();
        if(tabFragments) {
            for(let i = 0; i < tabFragments.length; i++) {
                tabContent.appendChild(tabFragments[i].getTabContent());
            }
        }

        // enable/disable button
        let tabHeader = tabElement.getElementsByClassName(C_sidebar_header_class)[0];
        if(this.getState().hasCheckButton()) {
            // create enable button in sidebar tab header
            let tabEnableBtn = document.createElement("input");
            tabEnableBtn.setAttribute("type", "checkbox");
            tabEnableBtn.setAttribute("id", this.getState().getId() + '-enable-btn');
            var _this = this;
            tabEnableBtn.onclick = function() {
                // onclick event handler enables/disables its items
                _this.setChecked(this.checked);
            }
            tabHeader.insertBefore(tabEnableBtn, tabHeader.firstChild);

            if(this.getState().getTool().isEnabled()) {
                tabEnableBtn.setAttribute(C_checked_class, "true");
            }
        }

        //  initial state
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

    /**
     * It returns tab pane which will be placed in sidebar tab.
     *
     * This function can be extended.
     */
    getTabContent() {
        return document.createTextNode("This is tab content");
    }

    /**
     * Functions changes layer state to enabled/disabled.
     *
     * @param {*} checked
     */
    setChecked(checked) {
        let tool = this.getState().getTool();
        if(checked != tool.isEnabled()) {
            // enable/disable sidebar tab
            let sidebarTab = d3.select("#" + this.getState().getId());
            if(sidebarTab != undefined) {
                // emhasize tab
                sidebarTab.classed(C_enabled_class, checked);
                sidebarTab.select("." + C_sidebar_header_class).classed(C_enabled_class, checked);
                // enable sidebar inputs
                sidebarTab.select("." + C_sidebar_tab_content_class).selectAll("input").attr("disabled", checked ? null : "true");
                sidebarTab.select("." + C_sidebar_tab_content_class).selectAll("select").attr("disabled", checked ? null : "true");
                sidebarTab.select("." + C_sidebar_tab_content_class).selectAll("button").attr("disabled", checked ? null : "true");
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
     * This function can be extended.
     *
     * @param {*} checked
     */
    setTabContentChecked(checked) {
    }

}
export default AbstractTabControl;
