import IMapObjectDefaults from "../abstract/IMapObjectDefaults";
import IMapObject from "../abstract/IMapObject";
import IMapObjectProps from "../abstract/IMapObjectProps";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class AbstractMapObjectDefaults implements IMapObjectDefaults {

    protected static id: number;
    protected idString : string | undefined;

    /**
     * reference to the map object - some defaults can be derived from map object
     */
    protected mapObject: IMapObject | undefined;

    /**
     * It creates map object defaults.
     */
    constructor(mapObject : IMapObject) {
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
        if(AbstractMapObjectDefaults.id == undefined) {
            AbstractMapObjectDefaults.id = 0;
        }
        AbstractMapObjectDefaults.id++;
        return this.getType() + "-" + AbstractMapObjectDefaults.id;
    }
}
export default AbstractMapObjectDefaults;