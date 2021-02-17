import GenericObjectEvent from "../../../../model/event/generic/GenericObjectEvent";

/**
 * This class provides the map selection change event.
 * 
 * @author Jiri Hynek
 */
class SelectionToolEvent extends GenericObjectEvent {

    /**
     * It initializes event.
     */
    constructor(selectionTool, selection) {
        super(SelectionToolEvent.TYPE(), selectionTool, selection);
        this.selection = selection;
    }

    /**
     * Type of the event.
     */
    static TYPE() {
        return "selection-tool-event";
    }
}
export default SelectionToolEvent;