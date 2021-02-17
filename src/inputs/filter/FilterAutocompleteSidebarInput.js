import AbstractSidebarInput from "../AbstractSidebarInput";
import AutocompleteSidebarInput from "../input/AutocompleteSidebarInput";

const ID = "geovisto-input-filter-autocomplete";

const COMPONENT_DIV_CLASS = ID;
/**
 * This class represents sidebar input composed of three autocomplete inputs used for filters.
 * 
 * @author Jakub Kachlik
 * @author Jiri Hynek (refactoring, code review)
 */
class FilterAutocompleteSidebarInput extends AbstractSidebarInput {

    constructor(settings) {
        super(settings);

        // model
        this.dataModel = settings.data;
        this.opModel = settings.ops;
        this.valModel = settings.vals;

        // inputs
        this.dataInput = undefined;
        this.opInput = undefined;
        this.valInput = undefined;
    } 

    static ID(){
        return ID;
    }

    create() {
        if(this.input == undefined) {
            // create parent div
            this.input = document.createElement("div");
            this.input.classList.add(COMPONENT_DIV_CLASS);

            // initialize filter inputs
            this.valInput = new AutocompleteSidebarInput({ label: "Value", options: [], action: this.valModel.action });
            this.opInput = new AutocompleteSidebarInput({ label: "Operation", options: this.opModel.options, action: this.opModel.action });                        
            this.dataInput = new AutocompleteSidebarInput({ label: "Data", options: this.dataModel.options, action: this.dataModel.action });

            // create elements of filter inputs and add them to parent div
            this.input.appendChild(this.dataInput.create());
            this.input.appendChild(this.opInput.create());
            this.input.appendChild(this.valInput.create());
        }

        return this.input;
    }

    /**
     * It returns values of the inputs.
     */
    getValue() {
        return {
            data: this.dataInput.getValue(),
            op: this.opInput.getValue(),
            val: this.valInput.getValue(),
        };
    }

    /**
     * It sets values of the inputs.
     * 
     * @param {*} value 
     */
    setValue(value) {
        this.dataInput.setValue(value.data);
        this.opInput.setValue(value.op);
        this.valInput.setValue(value.val);
    }
}
export default FilterAutocompleteSidebarInput