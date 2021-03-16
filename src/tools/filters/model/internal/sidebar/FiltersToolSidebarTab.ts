import { AbstractSidebarTab, ISidebarTab, ISidebarTabDefaults, ISidebarTabProps } from "../../../../sidebar";
import FiltersToolSidebarTabDefaults from "./FiltersToolSidebarTabDefaults";
import IMapFilterRule from "../../types/filter/IMapFilterRule";
import IMapDataManager from "../../../../../model/types/data/IMapDataManager";
import IMapFiltersManager from "../../types/filter/IMapFilterManager";
import IFiltersTool from "../../types/tool/IFiltersTool";
import TabDOMUtil from "../../../../../util/TabDOMUtil";
import FilterAutocompleteFormInput from "../../../../../model/internal/inputs/filter/autocomplete/FilterAutocompleteFormInput";
import AutocompleteFormInput from "../../../../../model/internal/inputs/labeled/autocomplete/AutocompleteFormInput";

/**
 * This interface provides a help type which represents double (html element container, input).
 * 
 * @author Jiri Hynek
 */
interface InputItem {
    container: HTMLDivElement,
    input: FilterAutocompleteFormInput
}

/**
 * This class provides controls for management of filters sidebar tabs.
 * 
 * @author Jiri Hynek
 */
class FiltersToolSidebarTab extends AbstractSidebarTab<IFiltersTool> implements ISidebarTab {
    
    /**
     * TODO: exclude class variables to the defaults and state.
     */
    private mapDataManager: IMapDataManager;
    private dataDomainNames: string[];
    private filterManager: IMapFiltersManager;
    private operationNames: string[];
    private htmlContent: HTMLElement | null;
    private btnGroup: HTMLDivElement | null;
    private inputs: InputItem[];

    public constructor(tool: IFiltersTool, props: ISidebarTabProps | undefined) {
        super(tool, props);
        
        // help variables (TODO: move to the tab control state)
        this.mapDataManager = this.getTool().getMap().getState().getMapData();
        this.dataDomainNames = this.mapDataManager.getDataDomainNames();
        
        this.filterManager = this.getTool().getState().getFiltersManager();
        this.operationNames = this.filterManager.getNames();

        this.htmlContent = null;
        this.btnGroup = null;
        this.inputs = [];
    }
    
    /**
     * help function which returns default values of the sidebar tab
     * casted as FiltersToolSidebarTabDefaults.
     */
    public getDefaults(): FiltersToolSidebarTabDefaults {
        return <FiltersToolSidebarTabDefaults> super.getDefaults();
    }

    /**
     * It creates new defaults of the tab control.
     */
    public createDefaults(): ISidebarTabDefaults {
        return new FiltersToolSidebarTabDefaults(this);
    }

    /**
     * It returns tab content.
     * 
     */
    public getContent(): HTMLElement {
        if(this.htmlContent == undefined) {
            // tab pane
            this.htmlContent = document.createElement('div');

            // btn group
            this.btnGroup = this.htmlContent.appendChild(document.createElement('div'));
            this.btnGroup.setAttribute("class", "filterButtons");

            // append add button
            var _this = this;
            this.btnGroup.appendChild(TabDOMUtil.createButton("<i class=\"fa fa-plus-circle\"></i>", function() { FiltersToolSidebarTab.addSelectItem(_this); }, "plusBtn" ));

            // append apply button
            this.btnGroup.appendChild(TabDOMUtil.createButton("Apply", function() {
                _this.inputChangedAction();
            },"applyBtn"));

            // import inputs according to configuration
            this.setFilterRules(this.getTool().getState().getFilterRules());
        }

        return this.htmlContent;
    }

    /**
     * Help static function which adds new select item to the filter sidebar tab.
     * 
     * @param _this 
     */
    private static addSelectItem(_this: FiltersToolSidebarTab): InputItem | null {
        // div container
        if(_this.htmlContent) {
            const defaults: FiltersToolSidebarTabDefaults = <FiltersToolSidebarTabDefaults> _this.getDefaults();
            const div: HTMLDivElement = _this.htmlContent.insertBefore(document.createElement('div'), _this.btnGroup);
            div.classList.add(defaults.getFilterRuleElementClass());
            
            const minusButton = TabDOMUtil.createButton("<i class=\"fa fa-minus-circle\"></i>",
                                                        function(e: MouseEvent) { FiltersToolSidebarTab.removeSelectItem(e, _this); }, "minusBtn");        
            div.appendChild(minusButton);

            /**
             * Help function which is invoked when the data domain input is changed.
             * It changes possible options of the operation and value inputs.
             * 
             * TODO: specify type of the param
             * 
             * @param e 
             */
            const updateValueOptions = function(e: any) {
                // find the input item
                let input: FilterAutocompleteFormInput | null = null;
                const div: HTMLElement | null = e.target.closest("." + defaults.getFilterRuleElementClass());
                for(let i = 0; i < _this.inputs.length; i++) {
                    if(_this.inputs[i].container == div) {
                        input = _this.inputs[i].input;
                        break;
                    }
                }

                if(input) {
                    const inputElement: { 
                        data: AutocompleteFormInput,
                        op: AutocompleteFormInput,
                        val: AutocompleteFormInput
                    } | null = input.getInputElement();

                    if(inputElement) {
                        // get selected value of the data domain input
                        const dataDomainName = e.target.value;
                        
                        // test if defined
                        if(dataDomainName != undefined && dataDomainName != "") {
                                // enable operation and value inputs
                                inputElement.op.setDisabled(false);
                                inputElement.val.setDisabled(false);
                                
                                // find possible values of selected data domain
                                const dataDomain = _this.mapDataManager.getDataDomain(dataDomainName);
                                if(dataDomain) {
                                    // update options of the value input
                                    inputElement.val.setOptions(_this.mapDataManager.getValues(dataDomain));
                                }
                            
                        } else {
                            // disable operation and value inputs
                            inputElement.op.setDisabled(true);
                            inputElement.op.setValue("");
                            inputElement.val.setDisabled(true);
                            inputElement.val.setValue("");
                        }
                    }
                }
            };

            const dataDomain = _this.mapDataManager.getDataDomain(_this.dataDomainNames[0]);

            // inputs
            const input = new FilterAutocompleteFormInput({
                data: {
                    options: _this.dataDomainNames,
                    onChangeAction: updateValueOptions
                },
                ops: {
                    options: _this.operationNames,
                    onChangeAction: function() { /* do nothing; TODO: update operators with respect to the data domain */ }
                },
                vals: {
                    options: dataDomain ? _this.mapDataManager.getValues(dataDomain) : [],
                    onChangeAction: function() { /* do nothing */ }
                }
            });

            div.appendChild(input.create());

            // help input item
            const inputItem: InputItem = {
                container: div,
                input: input
            };

            // list of input items
            _this.inputs.push(inputItem);

            return inputItem;
        }

        return null;
    }

    /**
     * Help static function which removes item from the filter sidebar tab.
     * 
     * @param _this 
     */
    private static removeSelectItem(e: MouseEvent, _this: FiltersToolSidebarTab): void {
        if(e.target) {
            // get div
            const div = (<HTMLInputElement> e.target).closest("div");

            // find input item and remove it from DOM and list of input items
            for(let i = 0; i < _this.inputs.length; i++) {
                if(_this.inputs[i].container == div) {
                    div.remove();
                    _this.inputs.splice(i, 1);
                    break;
                }
            }
        }
    }

    /**
     * It updates rules according to the input values.
     */
    private inputChangedAction(): void {
        this.getTool().setFilterRules(this.getFilterRules());
    }

    /**
     * It updates input values according to the selection.
     */
    private dimensionInputChangedAction(): void {
        // TODO
    }

    /**
     * It returns selected values from input fields and constructs filter rules.
     */
    public getFilterRules(): IMapFilterRule[] {
        const filterRules = [];
        let value;
        let dataDomain;
        for(let i = 0; i < this.inputs.length; i++) {
            // get input value
            value = this.inputs[i].input.getValue();
            // get data domain
            dataDomain = this.mapDataManager.getDataDomain(value.data);
            if(dataDomain) {
                // new filter rule
                const filterRule: IMapFilterRule | null = this.filterManager.createRule(dataDomain, value.op, value.val);
                if(filterRule) {
                    filterRules.push(filterRule);
                }
            }
        }
        return filterRules;
    }

    /**
     * It updates input fileds according to the given filter rules.
     * 
     * @param filterRules 
     */
    public setFilterRules(filterRules: IMapFilterRule[]): void {
        // clear inputs
        for(let i = 0; i < this.inputs.length; i++) {
            this.inputs[i].container.remove();
        }
        this.inputs = [];

        if(filterRules == undefined || filterRules.length == 0) {
            // if filter rules are empty, initialize one empty input item
            FiltersToolSidebarTab.addSelectItem(this);
        } else {
            // import inputs according to given filter rules
            for(let i = 0; i < filterRules.length; i++) {
                // create input for given filter rule
                FiltersToolSidebarTab.addSelectItem(this)?.input.setValue({
                    data: filterRules[i].getDataDomain().toString(),
                    op: filterRules[i].getFilterOperation().toString(),
                    val: filterRules[i].getPattern()
                });
            }
        }
    }
}
export default FiltersToolSidebarTab;