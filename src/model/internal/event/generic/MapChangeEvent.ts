import MapEvent from "./MapEvent";
import IMapObject from "../../../types/object/IMapObject";
import IMapChangeEvent from "../../../types/event/IMapChangeEvent";

/**
 * This class provides generic map change event object.
 * 
 * @author Jiri Hynek
 */
class MapChangeEvent extends MapEvent implements IMapChangeEvent {
    
    private object: any;

    /**
     * It initializes event.
     */
    constructor(type: string, source: IMapObject, changedObject: any) {
        super(type, source);
        
        this.object = changedObject;
    }

    /**
     * Return the changed object.
     */
    getChangedObject(): any {
        return this.object;
    }
}
export default MapChangeEvent;