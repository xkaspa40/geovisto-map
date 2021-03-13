import IMapDataDomain from "../../../types/data/IMapDataDomain";

/**
 * The class wraps meta data path used to find data.
 * 
 * @author Jiri Hynek
 */
abstract class AbstractMapDataDomain implements IMapDataDomain {
    
    private originalDataDomain: any;

    /**
     *  It initializes the data domain wrapper providing a basic API.
     * 
     * @param originalDataDomain 
     */
    constructor(originalDataDomain: any) {
        this.originalDataDomain = originalDataDomain;
    }

    /**
     * The function returns the string representation of the map data domain
     * which is *unique* among the labels of other data domains.
     */
    public getOriginal(): string {
        return this.originalDataDomain;
    }

    /**
     * The function returns the string representation of the map data domain
     * which is *unique* among the labels of other data domains.
     */
    public abstract getName(): string;
}
export default AbstractMapDataDomain;