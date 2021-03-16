import MapEvent from "./MapEvent";
import IMapObject from "../../../types/object/IMapObject";
import IMapChangeEvent from "../../../types/event/IMapChangeEvent";

/**
 * This class provides generic map change event object.
 * 
 * @author Jiri Hynek
 */
class MapChangeEvent<TSource extends IMapObject, TChangedObject> extends MapEvent<TSource> implements IMapChangeEvent<TSource, TChangedObject> {
    
    private changedObject: TChangedObject;

    /**
     * It initializes event.
     */
    public constructor(type: string, source: TSource, changedObject: TChangedObject) {
        super(type, source);
        
        this.changedObject = changedObject;
    }

    /**
     * Return the changed object.
     */
    public getChangedObject(): TChangedObject {
        return this.changedObject;
    }
}
export default MapChangeEvent;