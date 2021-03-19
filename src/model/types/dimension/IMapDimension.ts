import IMapCategory from "../category/IMapCategory";
import IMapDataDomain from "../data/IMapDataDomain";

/**
 * This interface declares functions for using a map dimension which allows to set a data domain.
 * 
 * @author Jiri Hynek
 */
interface IMapDimension extends IMapCategory {

    /**
     * It returns data domain which is set to the map dimension.
     */
    getDataDomain(): IMapDataDomain | undefined;

    /**
     * It sets the data domain which is set to the map dimension.
     * 
     * @param dataDomain 
     */
    setDataDomain(dataDomain: IMapDataDomain | undefined): void;
}
export default IMapDimension;