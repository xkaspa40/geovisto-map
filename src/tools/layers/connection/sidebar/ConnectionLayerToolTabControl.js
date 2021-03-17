import ConnectionLayerToolTabControlDefaults from "./ConnectionLayerToolTabControlDefaults";
import ConnectionLayerToolTabControlState from "./ConnectionLayerToolTabControlState";
import AbstractLayerToolSidebarTab from "../../../sidebar/model/internal/tab/sidebar/AbstractLayerToolSidebarTab";
import SidebarInputFactory from "../../../../model/internal/inputs/SidebarInputFactory";

/**
 * This class provides controls for management of the layer sidebar tab.
 * 
 * @author Jiri Hynek
 */
class ConnectionLayerToolTabControl extends AbstractLayerToolSidebarTab {

    constructor(tool) {
        super(tool);

        this.tabContent = undefined;
    }

    /**
     * It creates new defaults of the tab control.
     */
    createDefaults() {
        return new ConnectionLayerToolTabControlDefaults();
    }

    /**
     * It creates new state of the tab control.
     */
    createState() {
        return new ConnectionLayerToolTabControlState();
    }

    /**
     * It acquire selected data mapping from input values.
     */
    getInputValues() {
        // get data mapping model
        let model = this.getDefaults().getDataMappingModel();
        
        // create new selection
        let dataMapping = {};

        // get selected data domains values
        dataMapping[model.from.name] = this.inputFrom.getValue();
        dataMapping[model.to.name] = this.inputTo.getValue();

        return dataMapping;
    }

    /**
     * It updates selected input values according to the given data mapping.
     * 
     * @param dataMapping 
     */
    setInputValues(dataMapping) {
        // get data mapping model
        let model = this.getDefaults().getDataMappingModel();

        // update inputs
        this.inputFrom.setValue(dataMapping[model.from.name]);
        this.inputTo.setValue(dataMapping[model.to.name]);
    }

    /**
     * It returns the sidebar tab pane.
     */
    getContent() {
        var _this = this;

        // event handler: change dimension action
        let changeDimensionAction = function(e) {
            // get selected values and update layer's data mapping
            _this.getTool().updateDataMapping(_this.getInputValues());
        };
        
        // tab content
        let tab = document.createElement('div');
        let elem = tab.appendChild(document.createElement('div'));

        // get data mapping model
        let model = this.getDefaults().getDataMappingModel();
        let dataDomainLabels = this.getTool().getMap().getState().getMapData().getDataDomainLabels();

        // select from
        this.inputFrom = SidebarInputFactory.createSidebarInput(model.from.input, { label: model.from.label , options: dataDomainLabels, action: changeDimensionAction });
        elem.appendChild(this.inputFrom.create());

        // select to
        this.inputTo = SidebarInputFactory.createSidebarInput(model.from.input, { label: model.to.label , options: dataDomainLabels, action: changeDimensionAction });
        elem.appendChild(this.inputTo.create());

        this.setInputValues(this.getTool().getState().getDataMapping());
        
        return tab;
    }

}
export default ConnectionLayerToolTabControl;