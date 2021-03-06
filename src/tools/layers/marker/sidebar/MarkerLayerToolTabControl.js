import MarkerLayerToolTabControlDefaults from "./MarkerLayerToolTabControlDefaults";
import MarkerLayerToolTabControlState from "./MarkerLayerToolTabControlState";
import AbstractLayerToolTabControl from "../../abstract/sidebar/AbstractLayerToolTabControl";
import SidebarInputFactory from "../../../../model/internal/inputs/SidebarInputFactory";

/**
 * This class provides controls for management of the layer sidebar tab.
 * 
 * @author Jiri Hynek
 */
class MarkerLayerToolTabControl extends AbstractLayerToolTabControl {

    constructor(tool) {
        super(tool);

        this.tabContent = undefined;
    }

    /**
     * It creates new defaults of the tab control.
     */
    createDefaults() {
        return new MarkerLayerToolTabControlDefaults();
    }

    /**
     * It creates new state of the tab control.
     */
    createState() {
        return new MarkerLayerToolTabControlState();
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
        dataMapping[model.country.name] = this.inputCountry.getValue();
        dataMapping[model.value.name] = this.inputValue.getValue();
        dataMapping[model.aggregation.name] = this.inputAggregation.getValue();
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
        this.inputCountry.setValue(dataMapping[model.country.name]);
        this.inputValue.setValue(dataMapping[model.value.name]);
        this.inputAggregation.setValue(dataMapping[model.aggregation.name]);
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

        // select country
        this.inputCountry = SidebarInputFactory.createSidebarInput(model.country.input, { label: model.country.label , options: dataDomainLabels, action: changeDimensionAction });
        elem.appendChild(this.inputCountry.create());

        // select value
        this.inputValue = SidebarInputFactory.createSidebarInput(model.value.input, { label: model.value.label , options: dataDomainLabels, action: changeDimensionAction });
        elem.appendChild(this.inputValue.create());

        // select aggregation
        this.inputAggregation = SidebarInputFactory.createSidebarInput(model.aggregation.input, { label: model.aggregation.label, options: model.aggregation.options, action: changeDimensionAction });
        elem.appendChild(this.inputAggregation.create());

        // select category
        this.inputCategory = SidebarInputFactory.createSidebarInput(model.category.input, { label: model.category.label, options: dataDomainLabels, action: changeDimensionAction });
        elem.appendChild(this.inputCategory.create());

        this.setInputValues(this.getTool().getState().getDataMapping());
        
        return tab;
    }

}
export default MarkerLayerToolTabControl;