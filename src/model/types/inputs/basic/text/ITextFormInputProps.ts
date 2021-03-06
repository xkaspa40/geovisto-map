import IMapFormInputProps from "../../IMapFormInputProps";

/**
 * This class provide specification of a form input props model.
 * 
 * @author Jiri Hynek
 */
interface ITextFormInputProps extends IMapFormInputProps {
    onChangeAction : ((this: GlobalEventHandlers, ev: Event) => any) | null;
}
export default ITextFormInputProps;