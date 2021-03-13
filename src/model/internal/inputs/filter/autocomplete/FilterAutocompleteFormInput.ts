import AbstractMapFormInput from "../../abstract/AbstractMapFormInput";
import AutocompleteFormInput from "../../labeled/autocomplete/AutocompleteFormInput";
import IFilterFormInputProps from "../../../../types/inputs/filter/IFilterFormInputProps";
import IFilterFormInputValue from "../../../../types/inputs/filter/IFilterFormInputValue";

const ID = "geovisto-input-filter-autocomplete";

const COMPONENT_DIV_CLASS = ID;

/**
 * This class represents a form input composed of three autocomplete inputs used for filters.
 * 
 * @author Jakub Kachlik
 * @author Jiri Hynek (refactoring, code review)
 */
class FilterAutocompleteFormInput extends AbstractMapFormInput {

    /**
     * The input element is created when required.
     */
    private inputDiv: HTMLDivElement | undefined;
    
    /**
     * Input element is composed of 3 HTML select elements
     */
    private input: { 
        data: AutocompleteFormInput | undefined,
        op: AutocompleteFormInput | undefined,
        val: AutocompleteFormInput | undefined
    };

    constructor(props: IFilterFormInputProps) {
        super(props);

        // inputs
        this.input = {
            data: undefined,
            op: undefined,
            val: undefined,
        };
    } 

    /**
     * Static function returns identifier of the input type
     */
    public static ID(): string {
        return ID;
    }

    /**
     * It returns filter div element composed of 3 autocomplete form inputs.
     */
    public create(): HTMLElement {
        if(this.inputDiv == undefined) {
            // create parent div
            this.inputDiv = document.createElement("div");
            this.inputDiv.classList.add(COMPONENT_DIV_CLASS);

            // initialize filter inputs
            const props = <IFilterFormInputProps> this.getProps();
            this.input.val = new AutocompleteFormInput({ label: "Value", options: [], onChangeAction: props.vals.onChangeAction });
            this.input.op = new AutocompleteFormInput({ label: "Operation", options: props.ops.options, onChangeAction: props.ops.onChangeAction });                        
            this.input.data = new AutocompleteFormInput({ label: "Data", options: props.data.options, onChangeAction: props.data.onChangeAction });

            // create elements of filter inputs and add them to parent div
            this.inputDiv.appendChild(this.input.data.create());
            this.inputDiv.appendChild(this.input.op.create());
            this.inputDiv.appendChild(this.input.val.create());
        }

        return this.inputDiv;
    }

    /**
     * It returns values of the inputs.
     */
    public getValue(): IFilterFormInputValue {
        return {
            data: this.input.data ? this.input.data.getValue() : "",
            op: this.input.op? this.input.op.getValue() : "",
            val: this.input.val ? this.input.val.getValue() : "",
        };
    }

    /**
     * It sets values of the inputs.
     * 
     * @param value 
     */
    public setValue(value: IFilterFormInputValue): void {
        if(this.input.data && this.input.op && this.input.val) {
            this.input.data.setValue(value.data);
            this.input.op.setValue(value.op);
            this.input.val.setValue(value.val);
        }
    }
}
export default FilterAutocompleteFormInput;