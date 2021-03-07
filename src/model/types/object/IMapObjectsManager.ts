import IMapObject from "./IMapObject";

/**
 * This interface declares functions for using map objects which can be identified by uniquie string.
 * 
 * @author Jiri Hynek
 */
interface IMapObjectsManager {

    /**
     * The function returns available map objects.
     */
    getObjects(): IMapObject[]

    /**
     * The function returns the number of objects.
     */
    size(): number;

    /**
     * The function returns true if size() is 0.
     */
    isEmpty(): boolean;

    /**
     * It adds object to the list of objects.
     * 
     * @param {IMapObject} object 
     */
    add(object: IMapObject): void;

    /**
     * It removes object from the list of objects.
     * 
     * @param {IMapObject} object 
     */
    remove(object: IMapObject): void;

    /**
     * It removes object of the given id from the list of objects.
     * 
     * @param {string} id 
     */
    removeById(id: string): void;

    /**
     * Help function which returns the list of object string types.
     */
    getTypes(): string[];

    /**
     * Help function which returns the list of object string identifiers.
     */
    getIds(): string[];

    /**
     * The function returns map objects of given type.
     * 
     * @param {string} type
     */
    getByType(type: string): IMapObject[];

    /**
     * The function returns map object of given unique identifier.
     * 
     * @param {string} id
     */
    getById(id: string): IMapObject | undefined;
}
export default IMapObjectsManager;