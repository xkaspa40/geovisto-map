import AbstractMapDataDomain from '../abstract/AbstractMapDataDomain';

/**
 * The class wraps meta data path used to find data.
 * 
 * @author Jiri Hynek
 */
class JsonMapDataDomain extends AbstractMapDataDomain {
    
    private name: string;

    constructor(domainDescription: any) {
        super(domainDescription);
        this.name = domainDescription.join().replace(/,/g, ".");
    }

    /**
     * The function returns the string representation of the map data domain
     * which is *unique* among the names of other data domains.
     * 
     * It is uses dots to delimiter the array items.
     */
    getName() {
        return this.name;
    }
}
export default JsonMapDataDomain;