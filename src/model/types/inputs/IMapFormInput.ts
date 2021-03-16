/**
 * This interface represents description of form input.
 * 
 * @author Jiri Hynek
 */
interface IMapFormInput {

    /**
     * It creates an input element.
     */
    create(): HTMLElement;

    /**
     * It returns value of the input element.
     */
    getValue(): any;

    /**
     * It sets value of the input element.
     * 
     * @param value 
     */
    setValue(value: any): void;

}
export default IMapFormInput;