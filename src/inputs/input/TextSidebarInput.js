import AbstractSidebarInput from "../AbstractSidebarInput";

const ID = "geovisto-input-text";

/**
 * This class represents basic text sidebar input.
 * 
 * @author Jiri Hynek
 */
class TextSidebarInput extends AbstractSidebarInput {

    constructor(settings) {
        super(settings);
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
        if(this.input == undefined) {
            this.input = document.createElement("input");
            this.input.setAttribute("type", "text");
            this.input.onchange = this.action;
        }
        return this.input;
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
export default TextSidebarInput;