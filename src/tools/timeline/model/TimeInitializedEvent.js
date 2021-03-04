import { GenericObjectEvent } from "../../../index";

/**
 * This class provides the theme change event.
 *
 * @author Jiri Hynek
 */
class TimeInitializedEvent extends GenericObjectEvent {

    /**
     * It initializes event.
     */
    constructor(data, source = 'timeline') {
        super(TimeInitializedEvent.TYPE(), source, data);
    }

    /**
     * Type of the event.
     */
    static TYPE() {
        return "time-initialized-event";
    }
}
export default TimeInitializedEvent;
