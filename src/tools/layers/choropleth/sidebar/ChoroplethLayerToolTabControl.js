import ChoroplethLayerToolTabControlDefaults from "./ChoroplethLayerToolTabControlDefaults";
import ChoroplethLayerToolTabControlState from "./ChoroplethLayerToolTabControlState";
import AbstractLayerToolTabControl from "../../abstract/sidebar/AbstractLayerToolTabControl";
import SidebarInputFactory from "../../../../model/internal/inputs/SidebarInputFactory";

/**
 * This class provides controls for management of the layer sidebar tab.
 * 
 * @author Jiri Hynek
 */
class ChoropolethLayerToolTabControl extends AbstractLayerToolTabControl {

    constructor(tool) {
        super(tool);

        this.tabContent = undefined;
    }

    /**
     * It creates new defaults of the tab control.
     */
    createDefaults() {
        return new ChoroplethLayerToolTabControlDefaults();
    }

    /**
     * It creates new state of the tab control.
     */
    createState() {
        return new ChoroplethLayerToolTabControlState();
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
        // deprecated
        // dataMapping[model.color.name] = this.inputColor.getValue();

        return dataMapping;
    }

    /**
     * It updates selected input values according to the given data mapping.
     * 
     * @param dataMapping 
     */
    setInputValues(dataMapping) {
        // get data model
        let model = this.getDefaults().getDataMappingModel();

        // update inputs
        this.inputCountry.setValue(dataMapping[model.country.name]);
        this.inputValue.setValue(dataMapping[model.value.name]);
        this.inputAggregation.setValue(dataMapping[model.aggregation.name]);
        // deprecated
        //this.inputColor.setValue(dataMapping[model.color.name]);
    }

    /**
     * It returns the sidebar tab pane.
     */
    getContent() {
        var _this = this;

        // event handler: change color action
        let changeColorAction = function(e) {
           // get selected values and update layer's data mapping
           _this.getTool().updateDataMapping(_this.getInputValues(), true);
        };

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

        // select country
        this.inputCountry = SidebarInputFactory.createSidebarInput(model.country.input, { label: model.country.label , options: dataDomainLabels, action: changeDimensionAction });
        elem.appendChild(this.inputCountry.create());

        // select value
        this.inputValue = SidebarInputFactory.createSidebarInput(model.value.input, { label: model.value.label , options: dataDomainLabels, action: changeDimensionAction });
        elem.appendChild(this.inputValue.create());

        // select aggregation
        this.inputAggregation = SidebarInputFactory.createSidebarInput(model.aggregation.input, { label: model.aggregation.label, options: model.aggregation.options, action: changeDimensionAction });
        elem.appendChild(this.inputAggregation.create());

        // select color scheme
        // deprecated
        /*this.inputColor = SidebarInputFactory.createSidebarInput(model.color.input, { label: model.color.label, options: model.color.options, action: changeColorAction });
        elem.appendChild(this.inputColor.create());*/

        this.setInputValues(this.getTool().getState().getDataMapping());
        
        return tab;
    }

}
export default ChoropolethLayerToolTabControl;