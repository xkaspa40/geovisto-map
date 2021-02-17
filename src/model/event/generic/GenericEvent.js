import AbstractEvent from "../abstract/AbstractEvent";

/**
 * This class provides generic event object.
 * 
 * @author Jiri Hynek
 */
class GenericEvent extends AbstractEvent {

    /**
     * It initializes event.
     */
    constructor(type, source) {
        super();
        this.type = type;
        this.source = source;
    }

    /**
     * Returns string which identifies the event.
     */
    getType() {
        return this.type;
    }

    /**
     * Return source object of the event.
     */
    getSource() {
        return this.source;
    }
}
export default GenericEvent;