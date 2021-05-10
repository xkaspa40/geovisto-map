import DotLayerToolTabControlDefaults from "./DotLayerToolTabControlDefaults";
import DotLayerToolTabControlState from "./DotLayerToolTabControlState";
import AbstractLayerToolTabControl from "../../abstract/sidebar/AbstractLayerToolTabControl";
import SidebarInputFactory from "../../../../inputs/SidebarInputFactory";
import TabDOMUtil from "../../../../util/TabDOMUtil";
import DynamicClassifierSidebarInput from "../../../../inputs/dynamic/DynamicClassifierSidebarInput";
import ColorPickerInput from "../../../../inputs/input/ColorPickerInput";

/**
 * This class provides controls for management of the layer sidebar tab.
 * 
 * @author Petr Kaspar
 */
class DotLayerToolTabControl extends AbstractLayerToolTabControl {

    constructor(tool) {
        super(tool);

        this.tabContent = undefined;
        this.colorClassInputs = [];
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

        // event handler: change dimension action
        let changeDimensionAction = (e) => {
            // get selected values and update layer's data mapping
            this.getTool().updateDataMapping(this.getInputValues());
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

        //category color selector
        this.categoryClasses = document.createElement('div');
        this.categoryClasses.setAttribute('class', 'categoryClasses');
        elem.appendChild(this.categoryClasses);

        // horizontal rule
        let catClassSeparator = document.createElement('hr');
        this.categoryClasses.appendChild(catClassSeparator);

        //header text
        let catClassHeader = document.createElement('h2');
        catClassHeader.innerText = 'Category colors';
        this.categoryClasses.appendChild(catClassHeader);

        //button group
        this.buttonGroup = this.categoryClasses.appendChild(document.createElement('div'));
        this.buttonGroup.appendChild(TabDOMUtil.createButton("<i class=\"fa fa-plus-circle\"></i>",   () => this.addMappingInputs(), "plusBtn" ));
        this.buttonGroup.appendChild(TabDOMUtil.createButton("Apply", () => this.applyFilters(),
        "applyBtn"));

        const state = this.getTool().getState();
        this.setInputValues(state.getDataMapping());
        this.setFilterRules(state.getCategoryFilters());

        return tab;
    }

    /**
     * Creates set of inputs used for category color coding
     */
    addMappingInputs() {
        let div = this.categoryClasses.insertBefore(document.createElement('div'), this.buttonGroup);
        div.setAttribute('class', 'categoryClassesGroup');

        let minusButton = TabDOMUtil.createButton("<i class=\"fa fa-minus-circle\"></i>", (e) => {this.removeMappingInput(e)}, "minusBtn");
        div.appendChild(minusButton);

        const operations = this.getTool().getState().getFilterManager().getOperationLabels();
        let input = SidebarInputFactory.createSidebarInput(DynamicClassifierSidebarInput.ID(), {
            operations: {
                options: operations,
                action: () => {/**/}
            },
            values: {
                options: [],
                action: function() { /* do nothing; */ }
            },
            dynamic: {
                input: ColorPickerInput.ID(),
                label: 'Color',
                key: 'color',
                action: () => {/**/},
                options: []
            }
        });

        div.appendChild(input.create());
        this.colorClassInputs.push({
            input,
            container: div
        });
    }

    /**
     * Removes set of inputs used for category color coding
     *
     * @param e
     */
    removeMappingInput(e) {
        let inputGroup = e.target.closest(".categoryClassesGroup");
        this.colorClassInputs = this.colorClassInputs.filter((item) => item.container !== inputGroup);

        inputGroup.remove();
    }

    /**
     * Applies color coding and raises redraw
     */
    applyFilters() {
        let rules = [];
        this.colorClassInputs.forEach((input) => {
            const data = input.input.getValue();
            const manager = this.getTool().getState().getFilterManager();
            const operation = manager.getOperation(data.op)[0] ? manager.getOperation(data.op)[0] : undefined;
            data.val && data.color && operation && rules.push({
                operation,
                value: data.val,
                color: data.color
            });
        });

        this.getTool().getState().setCategoryFilters(rules);
        this.getTool().redraw();
    }

    /**
     * Creates and sets filters
     */
    setFilterRules(filters) {
        filters.forEach((filter, index) => {
           this.addMappingInputs();
           const values = {
               operation: filter.operation.toString(),
               value: filter.value,
               color: filter.color
           }
           this.colorClassInputs[index].input.setValue(values);
        });
    }
}
export default DotLayerToolTabControl;