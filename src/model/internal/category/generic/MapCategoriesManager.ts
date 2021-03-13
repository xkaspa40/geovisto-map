import IMapCategory from "../../../types/category/IMapCategory";
import IMapCategoriesManager from "../../../types/category/IMapCategoriesManager";

/**
 * This class provide functions for using map categories which can be identified by uniquie string.
 * 
 * @author Jiri Hynek
 */
class MapCategoriesManager<T extends IMapCategory> implements IMapCategoriesManager<T> {
    
    private categories: T[];

    /**
     * It initializes a map categories manager.
     */
    constructor(categories: T[] | undefined) {
        this.categories = categories ? categories : [];
    }

    /**
     * The function returns available map categories.
     */
    public getAll(): T[] {
        return this.categories;
    }

    /**
     * The function returns number of categories.
     */
    public size(): number {
        return this.categories.length;
    }

    /**
     * The function returns true if size() is 0.
     */
    public isEmpty(): boolean {
        return this.categories.length == 0;
    }

    /**
     * It adds category to the list of categories.
     * 
     * Override this function.
     * 
     * @param category 
     */
    public add(category: T): void {
        this.categories.push(category);
    }

    /**
     * It removes category from the list of categories.
     * 
     * @param category 
     */
    public remove(category: T): void {
        this.categories = this.categories.filter(item => item != category);
    }

    /**
     * It removes category from the list of categories.
     * 
     * Override this function.
     * 
     * @param id 
     */
    public removeByName(id: string): void {
        this.categories = this.categories.filter(item => item.getName() != id);
    }
    
    /**
     * Help function which returns the list of category string labels (category types).
     */
    public getNames(): string[] {
        const names: string[] = [];
        const categories = this.getAll();
        if(categories != undefined) {
            for(let i = 0; i < categories.length; i++) {
                names.push(categories[i].getName());
            }
        }
        return names;
    }

    /**
     * The function returns map categories of given type.
     * 
     * @param name
     */
    public getByName(name: string): T[] {
        const categories = this.getAll();
        const resultCategories: T[] = [];
        if(categories != undefined) {
            for(let i = 0; i < categories.length; i++) {
                if(categories[i].getName() == name) {
                    resultCategories.push(categories[i]);
                }
            }
        }
        return resultCategories;
    }
}
export default MapCategoriesManager;