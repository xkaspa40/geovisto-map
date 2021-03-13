import IMapCategory from "./IMapCategory";

/**
 * This interface declares functions for using map categories which can be identified by uniquie string.
 * 
 * @author Jiri Hynek
 */
interface IMapCategoriesManager<T extends IMapCategory> {

    /**
     * The function returns available map categories.
     */
    getAll(): T[];

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
     * @param category 
     */
    add(category: T): void;

    /**
     * It removes category from the list of categories.
     * 
     * @param category 
     */
    remove(category: T): void;

    /**
     * It removes category of the given name from the list of categories.
     * 
     * @param name 
     */
    removeByName(name: string): void;

    /**
     * Help function which returns the list of category string labels (category names).
     */
    getNames(): string[];

    /**
     * The function returns map categories of given name.
     * 
     * @param name
     */
    getByName(name: string): T[];
}
export default IMapCategoriesManager;