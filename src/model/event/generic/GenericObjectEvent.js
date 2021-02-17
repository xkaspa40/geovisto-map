import AbstractObjectEvent from "../abstract/AbstractObjectEvent";

/**
 * This class provides generic event object.
 * 
 * @author Jiri Hynek
 */
class GenericObjectEvent extends AbstractObjectEvent {

    /**
     * It initializes event.
     */
    constructor(type, source, object) {
        super(type, source);
        this.type = type;
        this.source = source;
        this.object = object;
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

    /**
     * Return the changed object.
     */
    getObject() {
        return this.object;
    }
}
export default GenericObjectEvent;