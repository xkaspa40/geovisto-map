import FlattenedMapData from './basic/FlattenedMapData';
import AbstractMapData from './AbstractMapData';

/**
 * Factory for map data objects.
 * 
 * @author Jiri Hynek
 */
class MapDataFactory {

    /**
     * Static function creates new map data of given class name.
     * 
     * @param {any} data 
     * @param {any} type 
     */
    static create(data, type) {
        let mapData;
        if(type == FlattenedMapData) {
            mapData = new FlattenedMapData(data);
        } else {
            mapData = new AbstractMapData(data);
        }
        return mapData;
    }
}

export default MapDataFactory;