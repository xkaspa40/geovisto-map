import IMapEvent from "./IMapEvent";
import IMapObject from "../object/IMapObject";

/**
 * This interface declares abstract map event change object.
 * 
 * @author Jiri Hynek
 */
interface IMapChangeEvent<TSource extends IMapObject, TChangedObject> extends IMapEvent<TSource> {

    /**
     * Return the changed object.
     */
    getChangedObject(): TChangedObject;
}
export default IMapChangeEvent;