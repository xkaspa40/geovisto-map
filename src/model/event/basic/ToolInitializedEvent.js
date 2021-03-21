import GenericObjectEvent from "../generic/GenericObjectEvent";


/**
 * This class provides the theme change event.
 *
 * @author Jiri Hynek
 */
export class ToolInitializedEvent extends GenericObjectEvent {

    /**
     * It initializes event.
     */
    constructor(source, data) {
        super(ToolInitializedEvent.TYPE(), source, data);
    }

    /**
     * Type of the event.
     */
    static TYPE() {
        return "tool-initialized-event";
    }
}
