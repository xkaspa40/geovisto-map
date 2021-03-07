import IMapObjectDefaults from "../object/IMapObjectDefaults";
import IMapTemplates from "./IMapTemplates";
import IMapToolsManager from "../tool/IMapToolsManager";
import IMapDataManager from "../data/IMapDataManager";
import IMapGlobals from "./IMapGlobals";
import IMapConfig from "./IMapConfig";
import IMapConfigManager from "../config/IMapConfigManager";

/**
 * This interface declares functions which return the default state values.
 *
 * @author Jiri Hynek
 */
interface IMapDefaults extends IMapObjectDefaults {

    /**
     * It returns default map config manager.
     */
    getConfigManager(): IMapConfigManager;

    /**
     * It returns default map config.
     */
    getConfig(): IMapConfig;

    /**
     * It returns default map templates.
     */
    getTemplates(): IMapTemplates;

    /**
     * It returns a default managers providing templates.
     */
    getToolTemplates(): IMapToolsManager;

    /**
     * It returns a default tools manager containing used tools.
     */
    getTools(): IMapToolsManager;

    /**
     * It returns default map data manager.
     */
    getMapData(): IMapDataManager;

    /**
     * It returns default geo polygons.
     * 
     * TODO: provide a GeoJSON manager.
     */
    getPolygons(): object;

    /**
     * It returns default geo centroids.
     * 
     * TODO: provide a GeoJSON manager.
     */
    getCentroids(): object;

    /**
     * It returns default global state variables.
     */
    getGlobals(): IMapGlobals;

    /**
     * It returns default zoom level.
     */
    getZoom(): number;

    /**
     * It returns default center coordinates in Leaflet map.
     */
    getMapCenter(): { lat: number, lng: number };

    /**
     * It returns the map structure defined with respect to the leaflet library.
     */
    getMapStructure(): { maxZoom: number, maxBounds: [[ number,number ],[ number,number ]] };
}
export default IMapDefaults;