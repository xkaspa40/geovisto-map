import AbstractMapFormInput from "../../abstract/AbstractMapFormInput";
import TabDOMUtil from "../../../../util/TabDOMUtil";
import IMapFormInput from "../../abstract/IMapFormInput";
import IAutocompleteFormInputProps from "./IAutocompleteFormInputProps";

const ID = "geovisto-input-autocomplete";

const COMPONENT_DIV_LABEL_CLASS = ID + "-label";

const COMPONENT_DIV_INPUT_CLASS = ID + "-component";

const COMPONENT_INPUT_CLASS = ID + "-value";

const COMPONENT_COMPLETION_LIST_CLASS = ID + "-popup";

const COMPONENT_COMPLETION_ITEM_CLASS = ID + "-option-m";

const COMPONENT_COMPLETION_NOT_IN_CLASS = ID + "-option-n";

const COMPONENT_COMPLETION_ACTIVE_ITEM_CLASS = ID + "-option-a"; 

/**
 * This class represents labeled text form input with autocomplete.
 * 
 * @author Jakub Kachlik
 * @author Jiri Hynek (refactoring, code review)
 */
class AutocompleteFormInput extends AbstractMapFormInput implements IMapFormInput {
    
    /**
     * Current options.
     */
    private options: string[];
    
    /**
     * DOM elements are created when required - optimization
     */
    private formDiv!: HTMLDivElement;
    private inputDiv!: HTMLDivElement;
    private input!: HTMLInputElement;
    private completionListDiv!: HTMLDivElement;
    
    /**
     * Index of the currently selected item.
     */
    private selectedCompletionItem: number;

    constructor(props: IAutocompleteFormInputProps){
        super(props);
        
        this.options = props.options ? props.options : [];
        
        // index of selected item in the completion list
        this.selectedCompletionItem = -1;
    }

    /**
     * Static function returns identifier of the input type.
     */
    public static ID(): string {
        return ID;
    }

    /*
     * Sets/removes attribute 'disabled' from input box.
     */
    public setDisabled(disabled: boolean) {
        if(this.input) {
            if(disabled == true) {
                this.input.setAttribute("disabled", "true");            
            } else {
                this.input.removeAttribute("disabled");
            }
        }
    }

    /*
     * Changes options for the completion list.
     */
    public changeOptions(newOptions: string[]) { 
        this.options = newOptions;
    }

    /*
     * Divides options into the two groups (matched and not matched values) with respect to the currently selected input.
     */
    private getCurrentOptions(): { match: string[], other: string[] } {
        let matchArray: string[] = [];
        let notMatchArray: string[] = [];
        if(this.input) {
            for(let i = 0; i < this.options.length; i++) {
                if(new String(this.options[i]).includes(this.input.value)) {
                    matchArray.push(this.options[i]);
                } else {
                    notMatchArray.push(this.options[i]);
                }
            }
        }
        return { match: matchArray, other: notMatchArray };
    }
    
    /**
     * It returns value of the input element.
     */
    public getValue(): string {
        throw this.input.value;
    }
    
    /**
     * It sets value of the input element.
     * 
     * @param {any} value 
     */
    public setValue(value: string): void {
        throw this.input.value = value;
    }
    
    /*
     * Creates whole autocomplete element including autocomplete box description and listeners.
     */
    public create(): HTMLDivElement {
        // create form
        this.createForm();

        // create listeners
        this.createListeners();

        return this.formDiv;
    }

    /*
     * Creates input elements.
     */
    protected createForm(): HTMLDivElement {
        // div for the whole autocomplete component
        this.formDiv = document.createElement('div'); 
        this.formDiv.classList.add(ID);

        // label div
        let labelDiv = document.createElement('div');
        labelDiv.classList.add(COMPONENT_DIV_LABEL_CLASS);
        labelDiv.innerHTML = (<IAutocompleteFormInputProps> this.getProps()).label;

        // input div
        this.inputDiv = document.createElement('div');
        this.inputDiv.classList.add(COMPONENT_DIV_INPUT_CLASS);

        // input
        this.input = document.createElement('input');
        TabDOMUtil.setAttributes(this.input,
            [ "class", "type", 'placeholder', 'type' ],
            [ COMPONENT_INPUT_CLASS, "text", 'choose dimension: ', 'hidden' ]);

        // construct elements
        this.formDiv.appendChild(labelDiv);
        this.formDiv.appendChild(this.inputDiv);
        this.inputDiv.appendChild(this.input);

        return this.formDiv;
    }

    /**
     * Creates event listeners and creates/removes 
     */
    protected createListeners(): void {
        if(this.input) {
            var _this = this;

            // when input changed, notify listeners
            this.input.onchange = (<IAutocompleteFormInputProps> this.getProps()).onChangeAction;

            // input change listener: create autocomplete and find
            this.input.addEventListener('input', function(e) {
                _this.createMenu();
            });

            // focus-in listener: create autocomplete
            this.input.addEventListener('focusin', function(e) {
                _this.createMenu();
            });

            // key-up/down listener
            this.input.addEventListener('keydown', function(e) {
                if (_this.completionListDiv != undefined) {
                    let completionItems = _this.completionListDiv.children;
                    
                    // remove active completion item
                    if(_this.selectedCompletionItem != -1 && completionItems[_this.selectedCompletionItem] != undefined){
                        completionItems[_this.selectedCompletionItem].classList.remove(COMPONENT_COMPLETION_ACTIVE_ITEM_CLASS);
                    }

                    // process key codes
                    if (e.keyCode == 40) {
                        // key Arrow down -> next item (checks array overflow)
                        _this.selectedCompletionItem = (_this.selectedCompletionItem + 1) % completionItems.length;
                        e.preventDefault();
                    } 

                    else if (e.keyCode == 38) {
                        // key Arrow up -> previous item (checks array overflow)
                        if(_this.selectedCompletionItem == -1) {
                            _this.selectedCompletionItem = 0; // initial move
                        }
                        _this.selectedCompletionItem = (_this.selectedCompletionItem + completionItems.length - 1) % completionItems.length;
                        e.preventDefault();
                    } 

                    else if (e.keyCode == 13 && _this.selectedCompletionItem != -1) {
                        // key Enter
                        //this.value = completionItems[_this.selectedCompletionItem].textContent;
                        _this.completionListDiv.remove();
                        _this.selectedCompletionItem != -1
                        // input on change event needs to be invoked manualy in this case
                        this.dispatchEvent(new Event("change"));
                    } 

                    else if(e.keyCode == 27 || e.keyCode == 9) {
                        // key Escape or Tab
                        _this.completionListDiv.remove();
                        _this.selectedCompletionItem != -1;
                    }

                    // set new active item
                    if(completionItems[_this.selectedCompletionItem] != undefined) {
                        completionItems[_this.selectedCompletionItem].classList.add(COMPONENT_COMPLETION_ACTIVE_ITEM_CLASS);
                    }

                    return false;
                }
            }, false);

            // click litener: click outside the input
            document.addEventListener('click', function(e) {
                // note: there is one listener for every input
                if(_this.completionListDiv != undefined && e.target != _this.input) {
                    _this.completionListDiv.remove();
                    _this.selectedCompletionItem != -1;
                }
            });
        }
    }

    /*
     * Creates and open MatchItems in PopUpList and set value according chosen input.
     */
    protected createMenu(): void {
        var _this = this;
        
        // if PopUpList already exist delete old one
        if (this.completionListDiv != undefined) {
            this.completionListDiv.remove();
        }

        // create completion list
        this.completionListDiv = document.createElement('div');
        this.completionListDiv.classList.add(COMPONENT_COMPLETION_LIST_CLASS);

        // help function which creates completion item
        let createCompletionItem = function(label: string, className: string) {
            // create item
            let completionItemDiv = document.createElement('div');
            completionItemDiv.innerHTML = label;
            completionItemDiv.classList.add(className);

             // add it to completion list div
            _this.completionListDiv.appendChild(completionItemDiv);
            
            // on click listener: the item has been selected
            completionItemDiv.addEventListener('click', function(e) {
                _this.input.value = completionItemDiv.textContent ? completionItemDiv.textContent : "";
                if(completionItemDiv.parentElement) {
                    completionItemDiv.parentElement.remove();
                }
                // input on change event needs to be invoked manualy in this case
                _this.input.dispatchEvent(new Event("change"));
            });
        }

        // create new completion item for every matched and not matched path
        var currentOptions = this.getCurrentOptions();
        currentOptions.match.forEach(element => createCompletionItem(element, COMPONENT_COMPLETION_ITEM_CLASS));
        currentOptions.other.forEach(element => createCompletionItem(element, COMPONENT_COMPLETION_NOT_IN_CLASS));
        
        // append completion list
        this.inputDiv.appendChild(this.completionListDiv);

        // reset selection
        _this.selectedCompletionItem = -1;
    }
}
export default AutocompleteFormInput;