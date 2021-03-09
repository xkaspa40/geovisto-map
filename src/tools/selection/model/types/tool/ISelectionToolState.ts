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
     * @param {ISelectionToolConfig} config 
     */
    deserialize(config: ISelectionToolConfig): void;

    /**
     * The method serializes the tool state. Optionally, defaults can be set if property is undefined.
     * 
     * @param {boolean} defaults
     */
    serialize(filterDefaults: boolean): ISelectionToolConfig;

    /**
     * It returns the selection property of the tool state.
     */
    getSelection(): IMapSelection;

    /**
     * It sets the selection property of the tool state.
     * 
     * @param {AbstractMapSelection} selection
     */
    setSelection(selection: IMapSelection): void;
}
export default ISelectionToolState;