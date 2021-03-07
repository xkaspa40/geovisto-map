import IMapEvent from "./IMapEvent";

/**
 * This interface declares abstract map event change object.
 * 
 * @author Jiri Hynek
 */
interface IMapChangeEvent extends IMapEvent {

    /**
     * Return the changed object.
     */
    getChangedObject(): any;
}
export default IMapChangeEvent;