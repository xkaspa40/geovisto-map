import SidebarToolDefaults from "./SidebarToolDefaults";
import AbstractToolState from "../../model/tool/abstract/AbstractToolState";

/**
 * This class provide sidebar tool model.
 * 
 * @author Jiri Hynek
 */
class SidebarToolState extends AbstractToolState {

    /**
     * It creates a tool state.
     */
    constructor() {
        super();
    }

    /**
     * It resets state with respect to initial props. Optionally, defaults can be set if property is undefined.
     * 
     * @param {SidebarToolDefaults} defaults 
     */
    reset(defaults) {
        super.reset(defaults);

        // tabs will be added by using addTab function.
        this.tabs = [];
    }

    /**
     * The metod takes config and desrializes the values.
     * 
     * @param {*} config 
     */
    deserialize(config) {
        super.deserialize(config);

        // original tabs desriptions are needed during tool creation.
        this.tabsDecriptions = config.tabs;
    }

    /**
     * The method serializes the tool configuration. Optionally, defaults can be set if property is undefined.
     * 
     * @param {SidebarToolDefaults} defaults
     */
    serialize(defaults) {
        let config = super.serialize(defaults);

        // serialize sidebar tabs
        config.tabs = [];
        for(let i = 0; i < this.tabs.length; i++) {
            config.tabs.push(this.tabs[i].getState().serialize())
        }

        return config;
    }

    /**
     * It returns the tabs descriptions.
     */
    getTabsDescriptions() {
        return this.tabsDecriptions;
    }

    /**
     * It returns the sidebar.
     */
    getSidebar() {
        return this.sidebar;
    }

    /**
     * It sets sidebar.
     * 
     * @param {*} sidebar 
     */
    setSidebar(sidebar) {
        this.sidebar = sidebar;
    }

    /**
     * It returns the tabs controls.
     */
    getTabs() {
        return this.tabs;
    }

    /**
     * It sets the tabs property of the tool state.
     * 
     * @param {*} tab
     */
    addTab(tab) {
        this.tabs.push(tab)
    }

    /**
     * It removes tab from the list of tabs.
     * 
     * @param {*} tab 
     */
    removeTab(tab) {
        const index = array.indexOf(tab);
        if (index > -1) {
            array.splice(index, 1);
        }
    }
}
export default SidebarToolState;