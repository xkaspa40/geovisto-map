import DotLayerToolTabControlDefaults from "./DotLayerToolTabControlDefaults";
import DotLayerToolTabControlState from "./DotLayerToolTabControlState";
import AbstractLayerToolTabControl from "../../abstract/sidebar/AbstractLayerToolTabControl";
import SidebarInputFactory from "../../../../inputs/SidebarInputFactory";
import TabDOMUtil from "../../../../util/TabDOMUtil";
import CategoryClassifierSidebarInput from "../../../../inputs/category/CategoryClassifierSidebarInput";
import FiltersToolDefaults from "../../../filters/FiltersToolDefaults";

/**
 * This class provides controls for management of the layer sidebar tab.
 * 
 * @author Jiri Hynek
 */
class DotLayerToolTabControl extends AbstractLayerToolTabControl {

    constructor(tool) {
        super(tool);

        this.tabContent = undefined;
        this.filterManager = new FiltersToolDefaults().getFiltersManager();
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

        this.setInputValues(this.getTool().getState().getDataMapping());
        
        return tab;
    }

    addMappingInputs() {
        let div = this.categoryClasses.insertBefore(document.createElement('div'), this.buttonGroup);
        div.setAttribute('class', 'categoryClassesGroup');

        let minusButton = TabDOMUtil.createButton("<i class=\"fa fa-minus-circle\"></i>", (e) => {this.removeMappingInput(e)}, "minusBtn");
        div.appendChild(minusButton);

        const operations = this.filterManager.getOperationLabels();
        let input = SidebarInputFactory.createSidebarInput(CategoryClassifierSidebarInput.ID(), {
            operations: {
                options: operations,
                action: () => {/**/}
            },
            values: {
                options: [],
                action: function() { /* do nothing; */ }
            },
            colors: {
                options: []
            }
        });

        div.appendChild(input.create());
        this.colorClassInputs.push({
            input,
            container: div
        });
    }

    removeMappingInput(e) {
        let inputGroup = e.target.closest(".categoryClassesGroup");
        this.colorClassInputs = this.colorClassInputs.filter((item) => item.container !== inputGroup);

        inputGroup.remove();
    }

    applyFilters() {
        let rules = [];
        this.colorClassInputs.forEach((input) => {
            const data = input.input.getValue();
            const operation = this.filterManager.getOperation(data.op)[0] ? this.filterManager.getOperation(data.op)[0].match : undefined;
            data.val && data.color && operation && rules.push({
                operation,
                value: data.val,
                color: data.color
            });
        });

        this.getTool().setCategoryFilters(rules);
    }
}
export default DotLayerToolTabControl;