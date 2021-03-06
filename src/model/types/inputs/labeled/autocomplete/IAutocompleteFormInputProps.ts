import IMapFormInputProps from "../../IMapFormInputProps";

/**
 * This class provide specification of a form input props model.
 * 
 * @author Jiri Hynek
 */
interface IAutocompleteFormInputProps extends IMapFormInputProps {
    onChangeAction : ((this: GlobalEventHandlers, ev: Event) => any) | null;
    label: string;
    options: string[];
}
export default IAutocompleteFormInputProps;