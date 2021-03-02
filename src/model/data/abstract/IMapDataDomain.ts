import IMapCategory from "../../category/abstract/IMapCategory";

/**
 * The class wraps meta data path used to find data.
 * 
 * @author Jiri Hynek
 */
interface IMapDataDomain extends IMapCategory {

    /**
     * It returns the original representation of data domain.
     */
    getOriginal(): any;

    /**
     * The function returns the string representation of the map data domain
     * which is *unique* among the labels of other data domains.
     * 
     * @returns {string}
     */
    getName(): string;
}
export default IMapDataDomain;