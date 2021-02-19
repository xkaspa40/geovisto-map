import IMapConfig from "../../../map/abstract/IMapConfig";
import AbstractMapConfigManager from "../abstract/AbstractMapConfigManager";
import IMapConfigManager from "../abstract/IMapConfigManager";

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
     * @param {any} config 
     */
    constructor(config: any) {
        super(config);
    }

    protected import(config: any): IMapConfig {
        return config;
    }

    /**
     * It returns map config of the implicit structure.
     * 
     * @param {IMapConfig} mapConfing 
     */
    public export(mapConfig: IMapConfig) {
        return mapConfig;
    }
}
export default MapConfigManager;