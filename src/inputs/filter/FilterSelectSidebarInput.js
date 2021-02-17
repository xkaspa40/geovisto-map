import AbstractSidebarInput from "../AbstractSidebarInput";

const ID = "geovisto-input-filter-select";

const COMPONENT_DIV_CLASS = ID;

/**
 * This class represents sidebar input composed of three selects used for filters.
 * 
 * @author Jiri Hynek
 */
class FilterSelectSidebarInput extends AbstractSidebarInput {

    constructor(settings) {
        super(settings);

        // model
        this.dataModel = settings.data;
        this.opModel = settings.ops;

        // inputs
        this.dataInput = undefined;
        this.opInput = undefined;
        this.valInput = undefined;
    }
    
    /**
     * Static function returns identifier of the input type
     */
    static ID() {
        return ID;
    }

    /**
     * It returns select element.
     */
    create() {
        if(this.input == undefined) {
            // create inline container
            this.input = document.createElement("div");
            this.input.classList.add(COMPONENT_DIV_CLASS);
            this.valInput = this.createInputElement();
            this.opInput = this.createSelectElement(function() { /* do nothing */ }, this.opModel.options);
            this.dataInput = this.createSelectElement(function(){ /* TODO: update options of other inputs */}, this.dataModel.options);

            // data select element
            this.input.appendChild(this.dataInput);

            // data op element
            this.input.appendChild(this.opInput);

            // data val element
            this.input.appendChild(this.valInput);
        }
        return this.input;
    }
    
    /**
     * Help static function which creates select element.
     * 
     * @param {*} action 
     * @param {*} options 
     */
    createSelectElement(action, options) {
        // create select element
        let select = document.createElement('select');
        select.onchange = action;
        // append options
        let option;
        for(let i = 0; i < options.length; i++) {
            option = select.appendChild(document.createElement("option"));
            option.setAttribute("value", options[i]);
            option.innerHTML = options[i];
        }
        return select;
    }

    /**
     * Help static function which creates select element.
     * 
     * @param {*} action 
     * @param {*} options 
     */
    createInputElement() {
        // create input element
        let input = document.createElement('input');
        input.setAttribute("type", "text");
        input.setAttribute("size", 10);
        return input
    }

    /**
     * It returns values of the inputs.
     */
    getValue() {
        return {
            data: this.dataInput.value,
            op: this.opInput.value,
            val: this.valInput.value,
        };
    }

    /**
     * It sets values of the inputs.
     * 
     * @param {*} value 
     */
    setValue(value) {
        this.dataInput.value = value.data;
        this.opInput.value = value.op;
        this.valInput.value = value.val;
    }
}
export default FilterSelectSidebarInput;