import AbstractMapDataDomain from '../AbstractMapDataDomain';

/**
 * The class wraps meta data path used to find data.
 * 
 * @author Jiri Hynek
 */
class FlattenedMapDataDomain extends AbstractMapDataDomain {

    constructor(domainDescription) {
        super(domainDescription);
        this.label = domainDescription.join().replace(/,/g, ".");
    }

    /**
     * The function returns the string representation of the map data domain
     * which is *unique* among the labels of other data domains.
     * 
     * It is uses dots to delimiter the array items.
     * 
     * @returns {string}
     */
    toString() {
        return this.label;
    }
}
export default FlattenedMapDataDomain;