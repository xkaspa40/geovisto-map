import IMapFormInput from "./IMapFormInput";
import IMapFormInputProps from "./IMapFormInputProps";

/**
 * This class represents an abstract form input.
 * 
 * @author Jiri Hynek
 */
abstract class AbstractMapFormInput implements IMapFormInput {
    
    /**
     * Input props passed to constructor.
     */
    private props: IMapFormInputProps;

    constructor(props: IMapFormInputProps) {
        this.props = props;
    }

    /**
     * It provides the props to the exteded classes.
     */
    protected getProps(): IMapFormInputProps {
        return this.props;
    }

    /**
     * It returns input element.
     */
    abstract create(): HTMLElement;

    /**
     * It returns value of the input element.
     */
    abstract getValue(): any;

    /**
     * It sets value of the input element.
     * 
     * @param {any} value 
     */
    abstract setValue(value: any): void;

}
export default AbstractMapFormInput;