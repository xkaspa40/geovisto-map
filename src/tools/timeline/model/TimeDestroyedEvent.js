import { GenericObjectEvent } from "../../../index";

/**
 * This class provides the theme change event.
 *
 * @author Jiri Hynek
 */
export class TimeDestroyedEvent extends GenericObjectEvent {

    /**
     * It initializes event.
     */
    constructor(data, source = 'timeline') {
        super(TimeDestroyedEvent.TYPE(), source, data);
    }

    /**
     * Type of the event.
     */
    static TYPE() {
        return "time-destroyed-event";
    }
}
