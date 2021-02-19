import MapChangeEvent from "../generic/MapChangeEvent";
import IMapObject from "../../object/abstract/IMapObject";
import IMapChangeEvent from "../abstract/IMapChangeEvent";

/**
 * This class provides the data change event object.
 * 
 * @author Jiri Hynek
 */
class DataChangeEvent extends MapChangeEvent implements IMapChangeEvent {

    /**
     * It initializes event.
     */
    constructor(source : IMapObject, data: any) {
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