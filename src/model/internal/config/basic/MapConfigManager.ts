import IMapConfig from "../../../types/map/IMapConfig";
import AbstractMapConfigManager from "../abstract/AbstractMapConfigManager";
import IMapConfigManager from "../../../types/config/IMapConfigManager";

/**
 * The class wraps config used by the map and functions to acquire config items.
 * 
 * @author Jiri Hynek
 */
class MapConfigManager extends AbstractMapConfigManager implements IMapConfigManager {

    /**
     * It initializes the config wrapper providing a basic API.
     * It expects a config represented by the implicict Geovisto map structure.
     * 
     * @param config 
     */
    constructor(config: any) {
        super(config);
    }

    /**
     * It converts given config to the internal map config structure.
     * It keeps the config structure.
     * 
     * @param mapConfing 
     */
    protected import(config: any): IMapConfig {
        return config;
    }

    /**
     * It returns map config of the implicit structure.
     * 
     * @param mapConfing 
     */
    public export(mapConfig: IMapConfig): any {
        return mapConfig;
    }
}
export default MapConfigManager;