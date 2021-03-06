import IMapCategory from "../../../types/category/IMapCategory";

/**
 * The abstract implementation of map category which overrides toString function.
 * 
 * @author Jiri Hynek
 */
abstract class AbstractMapCategory implements IMapCategory {

    /**
     * It returns the name of the category.
     */
    abstract getName(): string;

    /**
     * The string representation is equal to the name of the category.
     */
    public toString() {
        return this.getName();
    }
}
export default AbstractMapCategory;