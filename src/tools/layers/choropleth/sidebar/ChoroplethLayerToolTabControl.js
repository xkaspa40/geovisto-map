import ChoroplethLayerToolTabControlDefaults from "./ChoroplethLayerToolTabControlDefaults";
import ChoroplethLayerToolTabControlState from "./ChoroplethLayerToolTabControlState";
import AbstractLayerToolTabControl from "../../abstract/sidebar/AbstractLayerToolTabControl";
import SidebarInputFactory from "../../../../inputs/SidebarInputFactory";

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
        dataMapping[model.scaling.name] = this.scaling.getValue();
        dataMapping[model.range.name] = this.inputRange.getValue();
        dataMapping[model.strategy.name] = this.colorStrategy.getValue();
        dataMapping[model.color.name] = this.colorPicker.getValue();
        dataMapping[model.useCustomMinMax.name] = this.useCustomMinMax.getValue();
        dataMapping[model.minValue.name] = this.minValue.getValue();
        dataMapping[model.maxValue.name] = this.maxValue.getValue();

        return dataMapping;
    }

    /**
     * It updates selected input values according to the given data mapping.
     *
     * @param {*} dataMapping
     */
    setInputValues(dataMapping) {
        // get data model
        let model = this.getDefaults().getDataMappingModel();

        // update inputs
        this.inputCountry.setValue(dataMapping[model.country.name]);
        this.inputValue.setValue(dataMapping[model.value.name]);
        this.inputAggregation.setValue(dataMapping[model.aggregation.name]);
        this.scaling.setValue(dataMapping[model.scaling.name]);
        this.inputRange.setValue(dataMapping[model.range.name]);
        this.colorStrategy.setValue(dataMapping[model.strategy.name]);
        this.colorPicker.setValue(dataMapping[model.color.name]);
        this.useCustomMinMax.setValue(dataMapping[model.useCustomMinMax.name]);
        this.minValue.setValue(dataMapping[model.minValue.name]);
        this.maxValue.setValue(dataMapping[model.maxValue.name]);
    }

    /**
     * It returns the sidebar tab pane.
     */
    getTabContent() {
        var _this = this;

        // event handler: change color action
        let changeColorAction = function (e) {
            // get selected values and update layer's data mapping
            _this.getTool().updateDataMapping(_this.getInputValues(), true);
        }

        // event handler: change dimension action
        let changeDimensionAction = function (e) {
            // get selected values and update layer's data mapping
            _this.getTool().updateDataMapping(_this.getInputValues());
        }

        // tab content
        let tab = document.createElement('div');
        let elem = tab.appendChild(document.createElement('div'));

        // get data mapping model
        let model = this.getDefaults().getDataMappingModel();
        let dataDomainLabels = this.getTool().getMap().getState().getMapData().getDataDomainLabels();

        // select country
        this.inputCountry = SidebarInputFactory.createSidebarInput(model.country.input, { label: model.country.label, options: dataDomainLabels, action: changeDimensionAction });
        // select value
        this.inputValue = SidebarInputFactory.createSidebarInput(model.value.input, { label: model.value.label, options: dataDomainLabels, action: changeDimensionAction });
        // select aggregation
        this.inputAggregation = SidebarInputFactory.createSidebarInput(model.aggregation.input, { label: model.aggregation.label, options: model.aggregation.options, action: changeDimensionAction });
        //color strategy
        this.colorStrategy = SidebarInputFactory.createSidebarInput(model.strategy.input, { label: model.strategy.label, options: model.strategy.options, action: changeDimensionAction });
        //color strategy
        this.colorPicker = SidebarInputFactory.createSidebarInput(model.color.input, { input: this.colorStrategy, label: model.color.label, options: model.color.options, action: changeDimensionAction });
        // range
        this.inputRange = SidebarInputFactory.createSidebarInput(model.range.input, { min: 1, max: 7, default: 4, label: model.range.label, action: changeDimensionAction, elem: elem });
        // scaling type
        this.scaling = SidebarInputFactory.createSidebarInput(model.scaling.input, { label: model.scaling.label, options: model.scaling.options, action: changeDimensionAction });

        this.useCustomMinMax = SidebarInputFactory.createSidebarInput(
            model.useCustomMinMax.input,
            {
                label: model.useCustomMinMax.label,
                action: (e) => {
                    const { checked } = e.target;
                    this.minValue.setDisabled(!checked);
                    this.maxValue.setDisabled(!checked);

                    changeDimensionAction(e);
                }
            }
        );
        this.minValue = SidebarInputFactory.createSidebarInput(
            model.minValue.input,
            { label: model.minValue.label, type: "number", action: changeDimensionAction }
        );
        this.maxValue = SidebarInputFactory.createSidebarInput(
            model.maxValue.input,
            { label: model.maxValue.label, type: "number", action: changeDimensionAction }
        );

        elem.appendChild(this.inputCountry.create());
        elem.appendChild(this.inputValue.create());
        elem.appendChild(this.inputAggregation.create());
        elem.appendChild(this.colorStrategy.create());
        elem.appendChild(this.colorPicker.create());
        elem.appendChild(this.inputRange.create());
        elem.appendChild(this.scaling.create());
        elem.appendChild(this.useCustomMinMax.create());
        elem.appendChild(this.minValue.create());
        elem.appendChild(this.maxValue.create());

        this.setInputValues(this.getTool().getState().getDataMapping());

        const { useCustomMinMax } = this.getInputValues();
        this.minValue.setDisabled(!useCustomMinMax);
        this.maxValue.setDisabled(!useCustomMinMax);

        return tab;
    }

}
export default ChoropolethLayerToolTabControl;
