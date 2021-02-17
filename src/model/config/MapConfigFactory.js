import BasicMapConfig from './basic/BasicMapConfig';
import AbstractMapConfig from './AbstractMapConfig';

/**
 * Factory for map config records.
 * 
 * @author Jiri Hynek
 */
class MapConfigFactory {

    /**
     * Static function creates new map config of class name.
     * 
     * @param {any} config 
     * @param {any} type 
     */
    static create(config, type) {
        let mapConfig = null;
        if(type == BasicMapConfig) {
            mapConfig = new BasicMapConfig(config);
        } else {
            mapConfig = new AbstractMapConfig(config);
        }
        return mapConfig;
    }
}

export default MapConfigFactory;