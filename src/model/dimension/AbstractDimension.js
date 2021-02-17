/**
 * The class wraps a map dimension and its properties.
 * 
 * @author Jiri Hynek
 */
class AbstractMapDimension {

    constructor(description) {
        this.description = description;
    }

    getName() {
        return undefined;
    }

}
export default AbstractMapDimension;