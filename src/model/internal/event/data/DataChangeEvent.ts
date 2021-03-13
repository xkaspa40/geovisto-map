import MapChangeEvent from "../generic/MapChangeEvent";
import IMapObject from "../../../types/object/IMapObject";
import IMapChangeEvent from "../../../types/event/IMapChangeEvent";

/**
 * This class provides the data change event object.
 * 
 * TODO: define type of the data
 * 
 * @author Jiri Hynek
 */
class DataChangeEvent<TSource extends IMapObject> extends MapChangeEvent<TSource, any> implements IMapChangeEvent<TSource, any> {

    /**
     * It initializes event.
     */
    constructor(source: TSource, data: any) {
        super(DataChangeEvent.TYPE(), source, data);
    }

    /**
     * Type of the event.
     */
    public static TYPE(): string {
        return "data-change-event";
    }
}
export default DataChangeEvent;