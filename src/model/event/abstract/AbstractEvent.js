/**
 * This class provides abstract event class.
 * 
 * @author Jiri Hynek
 */
class AbstractEvent {

    /**
     * It initializes event.
     */
    constructor() {
    }

    /**
     * Returns string which identifies the event.
     */
    getType() {
        return undefined;
    }

    /**
     * Return source object of the event.
     */
    getSource() {
        return undefined;
    }
}
export default AbstractEvent;