import { GenericObjectEvent } from "../../../index";

/**
 * This class provides the theme change event.
 *
 * @author Jiri Hynek
 */
class TimeChangeEvent extends GenericObjectEvent {

    /**
     * It initializes event.
     */
    constructor(data, source = 'timeline') {
        super(TimeChangeEvent.TYPE(), source, data);
    }

    /**
     * Type of the event.
     */
    static TYPE() {
        return "time-change-event";
    }
}
export default TimeChangeEvent;
