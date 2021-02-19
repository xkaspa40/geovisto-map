import IMapEvent from "../abstract/IMapEvent";
import IMapObject from "../../object/abstract/IMapObject";

/**
 * This class provides generic map event object.
 * 
 * @author Jiri Hynek
 */
class MapEvent implements IMapEvent {
    
    private type: string;
    private source: IMapObject;

    /**
     * It initializes event.
     */
    constructor(type: string, source: IMapObject) {
        this.type = type;
        this.source = source;
    }

    /**
     * It returns string which identifies the event.
     */
    getType(): string {
        return this.type;
    }

    /**
     * It return source map object of the event.
     */
    getSource(): IMapObject {
        return this.source;
    }
}
export default MapEvent;