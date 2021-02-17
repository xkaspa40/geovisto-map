// styles
import "./styles/style.scss";

import TabDOMUtil from "../../../util/TabDOMUtil";
//import FilterSelectSidebarInput from "../../inputs/filter/FilterSelectSidebarInput";
import FilterAutocompleteSidebarInput from "../../../inputs/filter/FilterAutocompleteSidebarInput";
import SidebarInputFactory from "../../../inputs/SidebarInputFactory";
import FiltersToolTabControlDefaults from "./FiltersToolTabControlDefaults";
import FiltersToolTabControlState from "./FiltersToolTabControlState";
import AbstractTabControl from "../../sidebar/model/control/AbstractTabControl";

/**
 * This class provides controls for management of filters sidebar tabs.
 * 
 * TODO: exclude defaults and state variables
 * 
 * @author Jiri Hynek
 */
class FiltersToolTabControl extends AbstractTabControl {

    constructor(props) {
        super(props);
        
        // help variables (TODO: move to the tab control state)
        this.mapData = this.getTool().getMap().getState().getMapData();
        this.data = this.mapData.getData();
        this.dataDomainLabels = this.mapData.getDataDomainLabels();
        
        this.filterManager = this.getTool().getState().getFiltersManager();
        this.operationLabels = this.filterManager.getOperationLabels();

        this.tabContent = undefined;
        this.btnGroup = undefined;
        this.inputs = [];
        this.counter = 0;
    }

    /**
     * It creates new defaults of the tab control.
     */
    createDefaults() {
        return new FiltersToolTabControlDefaults();
    }

    /**
     * It creates new state of the tab control.
     */
    createState() {
        return new FiltersToolTabControlState();
    }

    /**
     * It returns tab content.
     * 
     */
    getTabContent() {
        if(this.tabContent == undefined) {
            // tab pane
            this.tabContent = document.createElement('div');

            // btn group
            this.btnGroup = this.tabContent.appendChild(document.createElement('div'));
            this.btnGroup.setAttribute("class", "filterButtons");

            // append add button
            var _this = this;
            this.btnGroup.appendChild(TabDOMUtil.createButton("<i class=\"fa fa-plus-circle\"></i>", function() { FiltersToolTabControl.addSelectItem(_this) }, "plusBtn" ));

            // append apply button
            this.btnGroup.appendChild(TabDOMUtil.createButton("Apply", function() {
                _this.inputChangedAction()
            },"applyBtn"));

            // import inputs according to configuration
            this.setFilterRules(this.getTool().getState().getFilterRules());
        }

        return this.tabContent;
    }

    /**
     * Help static function which adds new select item to the filter sidebar tab.
     * 
     * @param {*} _this 
     */
    static addSelectItem(_this) {
        // div container
        let div = _this.tabContent.insertBefore(document.createElement('div'), _this.btnGroup);
        div.classList.add(_this.getDefaults().getFilterRuleElementClass());
        
        var minusButton = TabDOMUtil.createButton("<i class=\"fa fa-minus-circle\"></i>", function(e) { FiltersToolTabControl.removeSelectItem(e, _this) }, "minusBtn");        
        div.appendChild(minusButton);

        /**
         * Help function which is invoked when the data domain input is changed.
         * It changes possible options of the operation and value inputs.
         * 
         * @param {*} e 
         */
        let updateValueOptions = function(e) {
            // find the input item
            let input = undefined
            let div = e.target.closest("." + _this.getDefaults().getFilterRuleElementClass());
            for(let i = 0; i < _this.inputs.length; i++) {
                if(_this.inputs[i].container == div) {
                    input = _this.inputs[i].input;
                    break;
                }
            }

            // get selected value of the data domain input
            let dataDomain = e.target.value;
            
            // test if defined
            if(dataDomain != undefined && dataDomain != "") {
                if(input != undefined) {
                    // enable operation and value inputs
                    input.opInput.setDisabled(false);
                    input.valInput.setDisabled(false);
                    
                    // find possible values of selected data domain
                    let values = _this.mapData.getValues(_this.mapData.getDataDomain(dataDomain));

                    // update options of the value input
                    input.valInput.changeOptions(values);
                }
            } else {
                // disable operation and value inputs
                input.opInput.setDisabled(true);
                input.opInput.setValue("");
                input.valInput.setDisabled(true);
                input.valInput.setValue("");   
            }
        }

        // inputs
        let input = SidebarInputFactory.createSidebarInput(FilterAutocompleteSidebarInput.ID(), {
            data: {
                options: _this.dataDomainLabels,
                action: updateValueOptions
            },
            ops: {
                options: _this.operationLabels,
                action: function() { /* do nothing; TODO: update operators with respect to the data domain */ }
            },
            vals: {
                currentData: _this.mapData.getValues(_this.mapData.getDataDomain(_this.dataDomainLabels[0])),
                action: function() { /* do nothing */ }
            }
        });

        div.appendChild(input.create());

        // help input item
        let inputItem = {
            container: div,
            input: input
        };

        // list of input items
        _this.inputs.push(inputItem);

        return inputItem;
    }

    /**
     * Help static function which removes item from the filter sidebar tab.
     * 
     * @param {*} _this 
     */
    static removeSelectItem(e, _this) {
        // get div
        let div = e.target.closest("div");

        // find input item and remove it from DOM and list of input items
        for(let i = 0; i < _this.inputs.length; i++) {
            if(_this.inputs[i].container == div) {
                div.remove();
                _this.inputs.splice(i, 1);
                break;
            }
        }
    }

    /**
     * It changes state to enabled/disabled.
     * 
     * @param {*} enabled
     */
    setContentState(enabled) {
        this.getTool().setEnabled(enabled);
    }

    /**
     * It updates rules according to the input values.
     */
    inputChangedAction() {
        this.getTool().setFilterRules(this.getFilterRules());
    }

    /**
     * It updates input values according to the selection.
     */
    dimensionInputChangedAction() {
        // TODO
    }

    /**
     * It returns selected values from input fields and constructs filter rules.
     */
    getFilterRules() {
        let filterRules = [];
        let value;
        let dataDomain;
        for(let i = 0; i < this.inputs.length; i++) {
            value = this.inputs[i].input.getValue();

            // get data domain
            dataDomain = this.mapData.getDataDomain(value.data);

            if(dataDomain != undefined) {
                // new filter rule
                let filterRule = this.filterManager.createRule(this.mapData.getDataDomain(value.data), value.op, value.val);
                if(filterRule != undefined) {
                    filterRules.push(filterRule);
                }
            }
        }
        return filterRules;
    }

    /**
     * It updates input fileds according to the given filter rules.
     * 
     * @param {*} filterRules 
     */
    setFilterRules(filterRules) {
        // clear inputs
        for(let i = 0; i < this.inputs.length; i++) {
            this.inputs[i].container.remove();
        }
        this.inputs = [];

        if(filterRules == undefined || filterRules.length == 0) {
            // if filter rules are empty, initialize one empty input item
            FiltersToolTabControl.addSelectItem(this);
        } else {
            // import inputs according to given filter rules
            for(let i = 0; i < filterRules.length; i++) {
                // create input for given filter rule
                FiltersToolTabControl.addSelectItem(this).input.setValue({
                    data: filterRules[i].getDataDomain().toString(),
                    op: filterRules[i].getFilterOperation().toString(),
                    val: filterRules[i].getPattern()});
            }
        }
    }
}
export default FiltersToolTabControl