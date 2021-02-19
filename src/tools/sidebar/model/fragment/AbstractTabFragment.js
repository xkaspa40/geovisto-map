import AbstractMapObject from "../../../../model/object/generic/AbstractMapObject";
import AbstractTabFragmentState from "./AbstractTabFragmentState";
import AbstractTabFragmentDefaults from "./AbstractTabFragmentDefaults";

/**
 * This class provides tab fragment for sidebar tab control.
 * 
 * This class is intended to be extended.
 * 
 * @author Jiri Hynek
 */
class AbstractTabFragment extends AbstractMapObject {

    constructor(props) {
        super(props);
    }

    /**
     * It creates new defaults of the tab control.
     */
    createDefaults() {
        return new AbstractTabFragmentDefaults();
    }

    /**
     * It creates the tab control state.
     */
    createState() {
        return new AbstractTabFragmentState();
    }

    /**
     * The function returns true if the tab fragment should be included in the tab control.
     * 
     * @param {*} tabControl 
     */
    isChild(tabControl) {
        return false;
    }

    /**
     * It initializes the tab control.
     * 
     * @param {*} tabControl 
     * @param {*} config 
     */
    initialize(tabControl, config) {
        // the tab control which stores the tab fragment
        // the tab control should not be undefined (this function is called only by tab control)
        this.getState().setTabControl(tabControl);

        // copy existing config if exists or use the default one
        this.getState().deserialize(this, config != undefined ? JSON.parse(JSON.stringify(config)) : this.getDefaults().getConfig());
        
        return this;
    }

    /**
     * It returns fragment of tab pane which will be placed in sidebar tab.
     * 
     * This function can be extended.
     */
    getTabContent() {
        return document.createTextNode("This is tab content"); 
    }

    /**
     * This function is called after the sidebar tab is rendered in sidebar.
     * 
     * This function can be extended.
     */
    postCreate() {
    }

    /**
     * Changes the state of the tool which is controled by this sidebar tab.
     * 
     * This function can be extended.
     * 
     * @param {*} checked 
     */
    setFragmentContentChecked(checked) {
    }

}
export default AbstractTabFragment;