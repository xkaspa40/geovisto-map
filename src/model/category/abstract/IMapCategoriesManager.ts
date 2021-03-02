import IMapCategory from "./IMapCategory";

/**
 * This class provide functions for using map categories which can be identified by uniquie string.
 * 
 * @author Jiri Hynek
 */
interface IMapCategoriesManager {

    /**
     * The function returns available map categories.
     */
    getCategories(): IMapCategory[]

    /**
     * The function returns the number of categories.
     */
    size(): number;

    /**
     * The function returns true if size() is 0.
     */
    isEmpty(): boolean;

    /**
     * It adds category to the list of categories.
     * 
     * @param {IMapCategory} category 
     */
    add(category: IMapCategory): void;

    /**
     * It removes category from the list of categories.
     * 
     * @param {IMapCategory} category 
     */
    remove(category: IMapCategory): void;

    /**
     * It removes category of the given name from the list of categories.
     * 
     * @param {string} name 
     */
    removeByName(name: string): void;

    /**
     * Help function which returns the list of category string labels (category names).
     */
    getNames(): string[];

    /**
     * The function returns map categories of given name.
     * 
     * @param {string} name
     */
    getByName(name: string): IMapCategory[];
}
export default IMapCategoriesManager;