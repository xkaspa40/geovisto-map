import IMapObjectDefaults from "../../types/object/IMapObjectDefaults";
import IMapObject from "../../types/object/IMapObject";
import IMapObjectProps from "../../types/object/IMapObjectProps";
import IMapObjectConfig from "../../types/object/IMapObjectConfig";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class MapObjectDefaults implements IMapObjectDefaults {

    protected static id: number;
    protected idString : string | undefined;

    /**
     * reference to the map object - some defaults can be derived from map object
     */
    protected mapObject: IMapObject | undefined;

    /**
     * It creates map object defaults.
     */
    public constructor(mapObject : IMapObject) {
        this.mapObject = mapObject;
    }

    /**
     * It returns the map object which works with the defaults.
     */
    protected getMapObject(): IMapObject | undefined {
        return this.mapObject;
    }

    /**
     * It returns default props if no props are given.
     */
    public getProps(): IMapObjectProps {
        return {
            id: this.getId()
        };
    }

    /**
     * It returns a default config if no config is given.
     */
    public getConfig(): IMapObjectConfig {
        return {
            type: undefined,
            id: undefined
        };
    }

    /**
     * It returns a unique type string of the tool.
     */
    public getType(): string {
        return "geovisto-object-abstract";
    }

    /**
     * It returns identifier which is used when no identifier is specified.
     */
    public getId(): string {
        if(!this.idString) {
            this.idString = this.generateId();
        }
        return this.idString;
    }

    /**
     * It returns identifier which is used when no identifier is specified.
     */
    protected generateId(): string {
        if(MapObjectDefaults.id == undefined) {
            MapObjectDefaults.id = 0;
        }
        MapObjectDefaults.id++;
        return this.getType() + "-" + MapObjectDefaults.id;
    }
}
export default MapObjectDefaults;