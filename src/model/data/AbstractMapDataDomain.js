/**
 * The class wraps meta data path used to find data.
 * 
 * @author Jiri Hynek
 */
class AbstractMapDataDomain {

    /**
     *  It initializes the data domain wrapper providing a basic API.
     * 
     * @param {any} domainDescription 
     */
    constructor(domainDescription) {
        this.domainDescription = domainDescription;
    }

    getDomainDescription() {
        return this.domainDescription;
    }

    /**
     * The function returns the string representation of the map data domain
     * which is *unique* among the labels of other data domains.
     * 
     * @returns {string}
     */
    toString() {
        return "";
    }
}
export default AbstractMapDataDomain;