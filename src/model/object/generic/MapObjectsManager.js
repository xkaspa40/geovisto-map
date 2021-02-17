import AbstractMapObjectsManager from "../abstract/AbstractMapObjectsManager";

/**
 * This class provide functions for using map objects which can be identified by uniquie string.
 * 
 * @author Jiri Hynek
 */
class MapObjectsManager extends AbstractMapObjectsManager {

    /**
     * It initializes a map objects manager.
     */
    constructor(objects) {
        this.objects = objects;
    }

    /**
     * The function returns available map objects.
     */
    getObjects() {
        return this.objects;
    }

    /**
     * The function returns number of objects.
     */
    size() {
        return this.objects.length;
    }

    /**
     * The function returns true if size() is 0.
     */
    isEmpty() {
        return this.objects.length == 0;
    }

    /**
     * It adds object to the list of objects.
     * 
     * Override this function.
     * 
     * @param {AbstractMapObject} object 
     */
    add(object) {
        this.objects.push(object);
    }

    /**
     * It removes object from the list of objects.
     * 
     * Override this function.
     * 
     * @param {AbstractMapObject} object 
     */
    remove(object) {
        this.objects = this.objects.filter(item => item != object);
    }

    /**
     * It removes object from the list of objects.
     * 
     * Override this function.
     * 
     * @param {string} id 
     */
    removeById(id) {
        this.objects = this.objects.filter(item => item.getId() != id);
    }
}
export default MapObjectsManager;