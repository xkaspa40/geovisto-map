import AbstractMapObject from "./AbstractMapObject";

/**
 * This class provide functions for using map objects which can be identified by uniquie string.
 * 
 * @author Jiri Hynek
 */
class AbstractMapObjectsManager {

    /**
     * It initializes a map objects manager.
     */
    constructor() {
    }

    /**
     * The function returns available map objects.
     * 
     * Override this function.
     */
    getObjects() {
        return [];
    }

    /**
     * The function returns the number of objects.
     */
    size() {
        return this.getObjects().length;
    }

    /**
     * The function returns true if size() is 0.
     */
    isEmpty() {
        return this.getObjects().length == 0;
    }

    /**
     * It adds object to the list of objects.
     * 
     * Override this function.
     * 
     * @param {AbstractMapObject} object 
     */
    add(object) {
    }

    /**
     * It removes object from the list of objects.
     * 
     * Override this function.
     * 
     * @param {AbstractMapObject} object 
     */
    remove(object) {
    }

    /**
     * It removes object from the list of objects.
     * 
     * Override this function.
     * 
     * @param {string} id 
     */
    removeById(id) {
    }

    /**
     * Help function which returns the list of object string labels (object types).
     */
    getTypes() {
        let types = [];
        let objects = this.getObjects();
        if(objects != undefined) {
            for(let i = 0; i < objects.length; i++) {
                types.push(objects[i].getType());
            }
        }
        return types;
    }

    /**
     * Help function which returns the list of object string labels (object types).
     */
    getIds() {
        let types = [];
        let objects = this.getObjects();
        if(objects != undefined) {
            for(let i = 0; i < objects.length; i++) {
                types.push(objects[i].getId());
            }
        }
        return types;
    }

    /**
     * The function returns map objects of given type.
     * 
     * @param {string} type
     */
    getByType(type) {
        let objects = this.getObjects();
        let resultObjects = [];
        if(objects != undefined) {
            for(let i = 0; i < objects.length; i++) {
                if(objects[i].getType() == type) {
                    resultObjects.push(objects[i]);
                }
            }
        }
        return resultObjects;
    }

    /**
     * The function returns map object of given unique identifier.
     * 
     * @param {string} id
     */
    getById(id) {
        let objects = this.getObjects();
        if(objects != undefined) {
            for(let i = 0; i < objects.length; i++) {
                if(objects[i].getId() == id) {
                    return objects[i];
                }
            }
        }
        return undefined;
    }
}
export default AbstractMapObjectsManager;