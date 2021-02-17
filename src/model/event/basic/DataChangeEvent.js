import GenericObjectEvent from "../generic/GenericObjectEvent";


/**
 * This class provides the theme change event.
 * 
 * @author Jiri Hynek
 */
class DataChangeEvent extends GenericObjectEvent {

    /**
     * It initializes event.
     */
    constructor(source, data) {
        super(DataChangeEvent.TYPE(), source, data);
    }

    /**
     * Type of the event.
     */
    static TYPE() {
        return "data-change-event";
    }
}
export default DataChangeEvent;