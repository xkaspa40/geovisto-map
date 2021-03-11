import AbstractSidebarTab from "../../../sidebar/model/internal/tab/AbstractSidebarTab";
import AbstractLayerToolTabControlDefaults from "./AbstractLayerToolTabControlDefaults";
import AbstractLayerToolTabControlState from "./AbstractLayerToolTabControlState";

/**
 * This class provides controls for management of the layer sidebar tab.
 * 
 * @author Jiri Hynek
 */
class AbstractLayerToolTabControl extends AbstractSidebarTab {

    constructor(tool) {
        super(tool);

        this.tabContent = undefined;
    }

    /**
     * It creates new defaults of the tab control.
     */
    createDefaults() {
        return new AbstractLayerToolTabControlDefaults();
    }

    /**
     * It creates new state of the tab control.
     */
    createState() {
        return new AbstractLayerToolTabControlState();
    }

    /**
     * It returns generic layer tab pane.
     */
    getTabContent() {
        if(this.tabContent == undefined) {
            // tab pane contains empty div element
            this.tabContent = document.createElement('div');
        }

        return this.tabContent; 
    }

    /**
     * It acquire selected data mapping from input values.
     * 
     * This function is intended to be extended.
     */
    getInputValues() {
        return {};
    }

    /**
     * It updates selected items according to the given selection.
     * 
     * This function is intended to be extended.
     * 
     * @param {*} dataMapping 
     */
    setInputValues(dataMapping) {
    }
}
export default AbstractLayerToolTabControl;