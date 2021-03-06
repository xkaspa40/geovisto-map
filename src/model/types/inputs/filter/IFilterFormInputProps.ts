import IMapFormInputProps from "../IMapFormInputProps";

/**
 * This class provide specification of form input props model.
 * 
 * @author Jiri Hynek
 */
interface IFilterFormInputProps extends IMapFormInputProps {
    ops: {
        options: string[],
        onChangeAction: ((this: GlobalEventHandlers, ev: Event) => any) | null
    };

    data: {
        options: string[],
        onChangeAction: ((this: GlobalEventHandlers, ev: Event) => any) | null
    };
    
    vals: {
        options: string[],
        onChangeAction: ((this: GlobalEventHandlers, ev: Event) => any) | null
    };
}
export default IFilterFormInputProps;