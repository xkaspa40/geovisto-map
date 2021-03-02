import IMapCategory from "../abstract/IMapCategory";
import IMapCategoriesManager from "../abstract/IMapCategoriesManager";

/**
 * This class provide functions for using map categories which can be identified by uniquie string.
 * 
 * @author Jiri Hynek
 */
class MapCategoriesManager implements IMapCategoriesManager {
    
    private categories: IMapCategory[];

    /**
     * It initializes a map categories manager.
     */
    constructor(categories: IMapCategory[] | undefined) {
        this.categories = categories ? categories : [];
    }

    /**
     * The function returns available map categories.
     */
    public getCategories(): IMapCategory[] {
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
     * @param {IMapCategory} category 
     */
    public add(category: IMapCategory): void {
        this.categories.push(category);
    }

    /**
     * It removes category from the list of categories.
     * 
     * @param {IMapCategory} category 
     */
    public remove(category: IMapCategory): void {
        this.categories = this.categories.filter(item => item != category);
    }

    /**
     * It removes category from the list of categories.
     * 
     * Override this function.
     * 
     * @param {string} id 
     */
    removeByName(id: string): void {
        this.categories = this.categories.filter(item => item.getName() != id);
    }
    
    /**
     * Help function which returns the list of category string labels (category types).
     */
    public getNames(): string[] {
        let names = [];
        let categories = this.getCategories();
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
     * @param {string} name
     */
    public getByName(name: string): IMapCategory[] {
        let categories = this.getCategories();
        let resultCategories: IMapCategory[] = [];
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