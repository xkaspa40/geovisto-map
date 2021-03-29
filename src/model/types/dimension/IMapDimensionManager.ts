import IMapDomainManager from "../domain/IMapDomainManager";
import IMapDimension from "./IMapDimension";

/**
 * This interface declares functions for using a map dimension which allows to set a data domain.
 * 
 * @author Jiri Hynek
 */
type IMapDimensionManager = IMapDomainManager<IMapDimension>
export default IMapDimensionManager;