const ID = "geovisto-input";

/**
 * This class represents abstract sidebar input.
 * 
 * This class is intended to be extended.
 * 
 * @author Jiri Hynek
 */
class AbstractSidebarInput {

    constructor(settings) {
        this.action = settings.action;
        this.input = undefined;
    }

    /**
     * Static function returns identifier of the input type.
     */
    static ID() {
        return ID;
    }

    /**
     * It returns input element.
     * 
     * This function is intended to be extended.
     */
    create() {
        if(this.input == undefined) {
            this.input = document.createElement("span");
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
export default AbstractSidebarInput;