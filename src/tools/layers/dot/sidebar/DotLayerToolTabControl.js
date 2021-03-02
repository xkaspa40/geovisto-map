import DotLayerToolTabControlDefaults from "./DotLayerToolTabControlDefaults";
import DotLayerToolTabControlState from "./DotLayerToolTabControlState";
import AbstractLayerToolTabControl from "../../abstract/sidebar/AbstractLayerToolTabControl";
import SidebarInputFactory from "../../../../inputs/SidebarInputFactory";

/**
 * This class provides controls for management of the layer sidebar tab.
 * 
 * @author Jiri Hynek
 */
class DotLayerToolTabControl extends AbstractLayerToolTabControl {

    constructor(tool) {
        super(tool);

        this.tabContent = undefined;
    }

    /**
     * It creates new defaults of the tab control.
     */
    createDefaults() {
        return new DotLayerToolTabControlDefaults();
    }

    /**
     * It creates new state of the tab control.
     */
    createState() {
        return new DotLayerToolTabControlState();
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
        dataMapping[model.latitude.name] = this.inputLat.getValue();
        dataMapping[model.longitude.name] = this.inputLong.getValue();
        dataMapping[model.category.name] = this.inputCategory.getValue();

        return dataMapping;
    }

    /**
     * It updates selected input values according to the given data mapping.
     * 
     * @param {*} dataMapping 
     */
    setInputValues(dataMapping) {
        // get data mapping model
        let model = this.getDefaults().getDataMappingModel();

        // update inputs
        this.inputLat.setValue(dataMapping[model.latitude.name]);
        this.inputLong.setValue(dataMapping[model.longitude.name]);
        // this.inputAggregation.setValue(dataMapping[model.aggregation.name]);
        this.inputCategory.setValue(dataMapping[model.category.name]);
    }

    /**
     * It returns the sidebar tab pane.
     */
    getTabContent() {
        var _this = this;

        // event handler: change dimension action
        let changeDimensionAction = function(e) {
            // get selected values and update layer's data mapping
            _this.getTool().updateDataMapping(_this.getInputValues());
        }
        
        // tab content
        let tab = document.createElement('div');
        let elem = tab.appendChild(document.createElement('div'));

        // get selection model
        let model = this.getDefaults().getDataMappingModel();
        let dataDomainLabels = this.getTool().getMap().getState().getMapData().getDataDomainLabels();

        // select latitude
        this.inputLat = SidebarInputFactory.createSidebarInput(model.latitude.input, { label: model.latitude.label , options: dataDomainLabels, action: changeDimensionAction });
        elem.appendChild(this.inputLat.create());

        // select longitude
        this.inputLong = SidebarInputFactory.createSidebarInput(model.longitude.input, { label: model.longitude.label , options: dataDomainLabels, action: changeDimensionAction });
        elem.appendChild(this.inputLong.create());

        // select category
        this.inputCategory = SidebarInputFactory.createSidebarInput(model.category.input, { label: model.category.label, options: dataDomainLabels, action: changeDimensionAction });
        elem.appendChild(this.inputCategory.create());

        this.setInputValues(this.getTool().getState().getDataMapping());
        
        return tab;
    }

}
export default DotLayerToolTabControl;