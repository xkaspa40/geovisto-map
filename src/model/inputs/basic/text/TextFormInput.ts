import AbstractMapFormInput from "../../abstract/AbstractMapFormInput";
import IMapFormInput from "../../abstract/IMapFormInput";
import ITextFormInputProps from "./ITextFormInputProps";

const ID = "geovisto-input-text";

/**
 * This class represents basic text form input.
 * 
 * @author Jiri Hynek
 */
class TextFormInput extends AbstractMapFormInput implements IMapFormInput {
    
    /**
     * Basic input is used.
     */
    private input: HTMLInputElement | undefined;

    constructor(props: ITextFormInputProps) {
        super(props);
    }

    /**
     * Static function returns identifier of the input type.
     */
    public static ID(): string {
        return ID;
    }

    /**
     * It returns input element.
     */
    public create(): HTMLElement {
        if(this.input == undefined) {
            this.input = document.createElement("input");
            this.input.setAttribute("type", "text");
            this.input.onchange = (<ITextFormInputProps> this.getProps()).onChangeAction;
        }
        return this.input;
    }

    /**
     * It makes input element visible for the extended classes.
     */
    protected getInput(): HTMLInputElement | undefined {
        return this.input;
    }

    /**
     * It returns value of the input element.
     */
    public getValue(): string {
        return this.input ? this.input.value : "";
    }

    /**
     * It sets value of the input element.
     * 
     * @param {string} value 
     */
    public setValue(value: string): void {
        if(this.input) {
            this.input.value = value;
        }
    }
}
export default TextFormInput;