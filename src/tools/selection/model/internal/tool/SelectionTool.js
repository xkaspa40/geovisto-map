import AbstractTool from "../../model/tool/abstract/AbstractTool";
import SelectionToolState from "./SelectionToolState";
import SelectionToolEvent from "../event/SelectionToolEvent";
import SelectionToolDefaults from "./SelectionToolDefaults";
import MapSelection from "../selection/generic/MapSelection";
import SelectionToolTabFragment from "../sidebar/SelectionToolTabFragment";

/**
 * This class provides the selection tool.
 * 
 * TODO: exclude defaults and state variables
 * 
 * @author Jiri Hynek
 */
class SelectionTool extends AbstractTool {

    /**
     * It creates a new tool with respect to the props.
     * 
     * @param {*} props 
     */
    constructor(props) {
        super(props);

        // the tab fragment for a sidebar tab will be created only if needed
        this.tabFragment = undefined
    }

    /**
     * A unique string of the tool type.
     */
    static TYPE() {
        return "geovisto-tool-selection";
    }

    /**
     * 
     */
    static EMPTY_SELECTION() {
        return new MapSelection(undefined, []);
    }

    /**
     * It creates a copy of the uninitialized tool.
     */
    copy() {
        return new SelectionTool(this.getProps());
    }

    /**
     * It creates new defaults of the tool.
     */
    createDefaults() {
        return new SelectionToolDefaults();
    }

    /**
     * It creates the tool state.
     */
    createState() {
        return new SelectionToolState();
    }

    /**
     * It creates new filter tool.
     */
    create() {
        // set selection
        // not necessary
        //this.setSelection(this.getState().getSelection());
    }

    /**
     * 
     * @param {*} selection 
     */
    setSelection(selection) {
        if(selection != undefined) {
            // if the selection tool is enabled, update map selection
            if(this.isEnabled()) {
                // update tool state
                this.getState().setSelection(selection);

                // dispatch event
                this.getMap().dispatchEvent(new SelectionToolEvent(this, selection));
            }
        }
    }

    /**
     * It returns a tab fragment.
     */
    getSidebarTabFragment() {
        if(this.tabFragment == undefined) {
            this.tabFragment = this.createSidebarTabFragment();
        }
        return this.tabFragment;
    }

    /**
     * It creates new tab control.
     * 
     * This function can be extended.
     */
    createSidebarTabFragment() {
        return new SelectionToolTabFragment({ tool: this});
    }
}
export default SelectionTool;