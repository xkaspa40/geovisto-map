import GenericObjectEvent from "../../../../../model/internal/event/generic/MapChangeEvent";
import IMapEvent from "../../../../../model/types/event/IMapEvent";
import ISelectionTool from "../tool/ISelectionTool";

/**
 * This class provides the map selection change event.
 * 
 * @author Jiri Hynek
 */
interface ISelectionToolEvent extends IMapEvent {

    /**
     * Return the selection tool which invoked this event.
     */
    getSource(): ISelectionTool;
}
export default ISelectionToolEvent;