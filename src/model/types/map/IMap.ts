import IMapObject from "../object/IMapObject";
import IMapEvent from "../event/IMapEvent";
import IMapConfigManager from "../config/IMapConfigManager";
import IMapDefaults from "./IMapDefaults";
import IMapProps from "./IMapProps";
import IMapState from "./IMapState";

/**
 * Declaration of map wrapper which handles map inputs (data, props, config), map tools and other map objects.
 * 
 * @author Jiri Hynek
 */
interface IMap extends IMapObject {

    /**
     * It returns object defaults as the map defaults.
     */
    getDefaults(): IMapDefaults;

    /**
     * It returns object state as the map state.
     */
    getState(): IMapState;

    /**
     * The function draws a new map.
     */
    draw(mapConfig: IMapConfigManager): void;

    /**
     * This function redraws the current map.
     */
    redraw(mapConfig: IMapConfigManager, props: IMapProps): void;

    /**
     * It exports the serialized representation of the current state of the map.
     */
    export(): object;

    /**
     * It updates data and invokes listeners.
     * 
     * @param {object[]} data
     * @param {IMapObject} source of the change
     */
    updateData(data: object[], source: IMapObject): void;
    
    /**
     * It sends custom event to all listeners (tools)
     * 
     * @param {AbstractEvent} event 
     */
    dispatchEvent(event: IMapEvent): void;
};
export default IMap;