import IMapObject from "../../types/object/IMapObject";
import IMapObjectsManager from "../../types/object/IMapObjectsManager";

/**
 * This class provide functions for using map objects which can be identified by uniquie string.
 * 
 * @author Jiri Hynek
 */
class MapObjectsManager implements IMapObjectsManager {
    
    private objects: IMapObject[];

    /**
     * It initializes a map objects manager.
     */
    constructor(objects: IMapObject[] | undefined) {
        this.objects = objects ? objects : [];
    }

    /**
     * The function returns available map objects.
     */
    public getObjects(): IMapObject[] {
        return this.objects;
    }

    /**
     * The function returns number of objects.
     */
    public size(): number {
        return this.objects.length;
    }

    /**
     * The function returns true if size() is 0.
     */
    public isEmpty(): boolean {
        return this.objects.length == 0;
    }

    /**
     * It adds object to the list of objects.
     * 
     * Override this function.
     * 
     * @param {IMapObject} object 
     */
    public add(object: IMapObject): void {
        this.objects.push(object);
    }

    /**
     * It removes object from the list of objects.
     * 
     * @param {IMapObject} object 
     */
    public remove(object: IMapObject): void {
        this.objects = this.objects.filter(item => item != object);
    }

    /**
     * It removes object from the list of objects.
     * 
     * Override this function.
     * 
     * @param {string} id 
     */
    removeById(id: string): void {
        this.objects = this.objects.filter(item => item.getId() != id);
    }
    
    /**
     * Help function which returns the list of object string labels (object types).
     */
    public getTypes(): string[] {
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
    public getIds(): string[] {
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
    public getByType(type: string): IMapObject[] {
        let objects = this.getObjects();
        let resultObjects: IMapObject[] = [];
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
    public getById(id: string): IMapObject | undefined {
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
export default MapObjectsManager;