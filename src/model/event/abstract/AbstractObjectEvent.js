import AbstractEvent from "./AbstractEvent";

/**
 * This class provides abstract event class which .
 * 
 * @author Jiri Hynek
 */
class AbstractObjectEvent extends AbstractEvent {

    /**
     * It initializes event.
     */
    constructor() {
        super();
    }

    /**
     * Return the changed object.
     */
    getObject() {
        return undefined;
    }
}
export default AbstractObjectEvent;