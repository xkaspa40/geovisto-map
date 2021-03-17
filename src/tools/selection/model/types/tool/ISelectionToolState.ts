import IMapToolState from "../../../../../model/types/tool/IMapToolState";
import IMapSelection from "../selection/IMapSelection";
import ISelectionToolConfig from "./ISelectionToolConfig";

/**
 * This interface declares functions for using selections.
 * 
 * @author Jiri Hynek
 */
interface ISelectionToolState extends IMapToolState {

    /**
     * The metod takes config and deserializes the values.
     * 
     * @param config 
     */
    deserialize(config: ISelectionToolConfig): void;

    /**
     * The method serializes the tool state. Optionally, defaults can be set if property is undefined.
     * 
     * @param filterDefaults
     */
    serialize(filterDefaults: boolean | undefined): ISelectionToolConfig;

    /**
     * It returns the selection property of the tool state.
     */
    getSelection(): IMapSelection | null;

    /**
     * It sets the selection property of the tool state.
     * 
     * @param selection
     */
    setSelection(selection: IMapSelection | null): void;
}
export default ISelectionToolState;