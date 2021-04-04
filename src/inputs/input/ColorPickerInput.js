import AbstractSidebarInput from "../AbstractSidebarInput";

const ID = "geovisto-input-colorPicker";

const COMPONENT_DIV_LABEL_CLASS = ID + "-label";

const COMPONENT_DIV_INPUT_CLASS = ID + "-component";

const COMPONENT_VALUE_CLASS = ID + "-value";

const COMPONENT_INPUT_CLASS = ID + "-input";
/**
 * This class represents basic text sidebar input.
 * 
 * @author Jiri Hynek
 */
class ColorPickerInput extends AbstractSidebarInput {

    constructor(settings) {
        super(settings);
        // settings
        this.options = settings.options;
        this.label = settings.label;
        this.setData = settings.setData;

        // div elements
        this.formDiv = undefined;
        this.inputDiv = undefined;
        this.completionListDiv = undefined;
    }

    /**
     * Static function returns identifier of the input type.
     */
    static ID() {
        return ID;
    }

    /**
     * It returns input element.
     */
    create() {
        var _this = this;
        // div for the whole autocomplete component
        this.formDiv = document.createElement('div');
        this.formDiv.classList.add(ID);

        // label div
        let labelDiv = document.createElement('div');
        labelDiv.classList.add(COMPONENT_DIV_LABEL_CLASS);
        labelDiv.innerHTML = _this.label;

        // input div
        this.inputDiv = document.createElement('div');
        this.inputDiv.classList.add(COMPONENT_DIV_INPUT_CLASS);

        let value = document.createElement('div');
        value.setAttribute("class", COMPONENT_VALUE_CLASS);

        this.input = document.createElement("input");
        this.input.setAttribute("type", "color");
        this.input.setAttribute("id", ID);
        this.input.onchange = this.action;




        // construct elements
        this.inputDiv.appendChild(this.input);
        this.inputDiv.appendChild(value);
        this.formDiv.appendChild(labelDiv);
        this.formDiv.appendChild(this.inputDiv);



        return this.formDiv;
    }

    /**
     * It returns value of the input element.
     */
    getValue() {
        return this.input.value;
    }

    /**
     * It sets value of the input element.
     * 
     * @param {*} value 
     */
    setValue(value) {
        this.input.value = value;
    }

}
export default ColorPickerInput;