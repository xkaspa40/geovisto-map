import ISelectionToolEvent from "../../types/event/ISelectionToolEvent";
import IMapSelection from "../../types/selection/IMapSelection";
import MapChangeEvent from "../../../../../model/internal/event/generic/MapChangeEvent";
import IMapTool from "../../../../../model/types/tool/IMapTool";

/**
 * This class provides the map selection change event.
 * 
 * @author Jiri Hynek
 */
class SelectionToolEvent extends MapChangeEvent<IMapTool, IMapSelection | null> implements ISelectionToolEvent {

    /**
     * It initializes event.
     */
    public constructor(selectionTool: IMapTool, selection: IMapSelection | null) {
        super(SelectionToolEvent.TYPE(), selectionTool, selection);
    }

    /**
     * Type of the event.
     */
    public static TYPE(): string {
        return "selection-tool-event";
    }
}
export default SelectionToolEvent;