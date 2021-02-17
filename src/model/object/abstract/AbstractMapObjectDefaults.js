/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class AbstractMapObjectDefaults {

    /**
     * It creates map object defaults.
     */
    constructor() {
    }

    /**
     * It initializes the map object defaults.
     * 
     * @param {*} object 
     */
    initialize(mapObject) {
        this.mapObject = mapObject;
    }

    /**
     * It returns the map object which works with the defaults.
     */
    getMapObject() {
        return this.mapObject;
    }

    /**
     * It returns default props if no props are given.
     */
    getProps() {
        return {};
    }

    /**
     * It returns a unique type string of the tool.
     */
    getType() {
        return "geovisto-object-abstract";
    }

    /**
     * It returns identifier which is used when no identifier is specified.
     */
    getId() {
        if(AbstractMapObjectDefaults.id == undefined) {
            AbstractMapObjectDefaults.id = 0;
        }
        AbstractMapObjectDefaults.id++;
        return this.getType() + "-" + AbstractMapObjectDefaults.id;
    }
}
export default AbstractMapObjectDefaults;