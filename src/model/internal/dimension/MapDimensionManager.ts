import MapDomainArrayManager from "../domain/generic/MapDomainArrayManager";
import IMapDimensionManager from "../../types/dimension/IMapDimensionManager";
import IMapDimension from "../../types/dimension/IMapDimension";
import IMapDomain from "../../types/domain/IMapDomain";

/**
 * This class provide functions for using map domains which can be identified by uniquie string.
 * 
 * @author Jiri Hynek
 */
class MapDimensionManager extends MapDomainArrayManager<IMapDimension<IMapDomain>> implements IMapDimensionManager {

    /**
     * It initializes a map domain manager.
     */
    public constructor(dimensions: IMapDimension<IMapDomain>[]) {
        super(dimensions);
    }
}
export default MapDimensionManager;