import AbstractSidebarInput from "../input/TextSidebarInput";

const ID = "geovisto-input-select";

/**
 * This class represents basic select sidebar input composed of options.
 * 
 * @author Jiri Hynek
 */
class SelectSidebarInput extends AbstractSidebarInput {

    constructor(settings) {
        super(settings);
        this.options = settings.options;
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
        if(this.element == undefined) {
            // create select element
            this.element = document.createElement('select');
            this.element.onchange = this.action;
            // append options
            let option;
            for(let i = 0; i < this.options.length; i++) {
                option = this.element.appendChild(document.createElement("option"));
                option.setAttribute("value", this.options[i]);
                option.innerHTML = this.options[i];
            }
        }
        return this.element;
    }

    /**
     * It returns value of the select element.
     */
    getValue() {
        return this.element.value;
    }

    /**
     * It sets value of the select element.
     * 
     * @param {*} value 
     */
    setValue(value) {
        this.element.value = value;
    }
}
export default SelectSidebarInput;