import IMapDefaults from "../../types/map/IMapDefaults";
import IMap from "../../types/map/IMap";
import IMapConfig from "../../types/map/IMapConfig";
import IMapConfigManager from "../../types/config/IMapConfigManager";
import IMapTemplates from "../../types/map/IMapTemplates";
import IMapToolsManager from "../../types/tool/IMapToolsManager";
import IMapDataManager from "../../types/data/IMapDataManager";
import IMapGlobals from "../../types/map/IMapGlobals";
import MapObjectDefaults from "../object/MapObjectDefaults";
import MapToolsManager from "../tool/MapToolsManager";
import MapConfigManager from "../config/basic/MapConfigManager";
import GeovistoMap from "./GeovistoMap";
import JsonMapDataManager from "../data/json/JsonMapDataManager";

import countryCentroids from '../../../../static/geo/country_centroids.json';
import countryPolygons from '../../../../static/geo/country_polygons.json';
import { SidebarTool, SettingsTool, FiltersTool, ThemesTool, SelectionTool, TilesLayerTool } from "../../../tools";

/**
 * This class provide functions which return the default state values.
 *
 * @author Jiri Hynek
 */
class GeovistoMapDefaults extends MapObjectDefaults implements IMapDefaults {
    
    private polygons: any;
    private centroids: any;

    /**
     * It creates map defaults.
     * 
     * @param map 
     */
    public constructor(map: IMap) {
        super(map);
    }

    /**
     * It returns default map config manager.
     */
    public getConfigManager(): IMapConfigManager {
        return new MapConfigManager({});
    }

    /**
     * It returns default map config.
     * 
     * All config variables are undefined since they might override the props.
     */
    public getConfig(): IMapConfig {
        return {
            id: undefined,
            type: undefined,
            tools: undefined,
            zoom: undefined,
            mapCenter: undefined,
            mapStructure: undefined
        };
    }

    /**
     * It returns a unique type string of the object.
     */
    public getType(): string {
        return GeovistoMap.TYPE();
    }

    /**
     * It returns a default managers providing templates.
     */
    public getTemplates(): IMapTemplates {
        return {
            tools: this.getToolTemplates(),
        };
    }

    /**
     * It returns a default tools manager containing used tools.
     */
    public getToolTemplates(): MapToolsManager {
        return new MapToolsManager([
            new SidebarTool(undefined),
            new SettingsTool(undefined),
            new FiltersTool(undefined),
            new ThemesTool(undefined),
            new SelectionTool(undefined),
            new TilesLayerTool(undefined),
            new ChoroplethLayerTool({ zindex: 350 }),
            new MarkerLayerTool(),
            new ConnectionLayerTool(),
        ]);
    }

    /**
     * It returns a default tools manager containing used tools.
     */
    public getTools(): IMapToolsManager {
        return new MapToolsManager([]);
    }

    /**
     * It returns default map data manager.
     */
    public getMapData(): IMapDataManager {
        return new JsonMapDataManager([]);
    }

    /**
     * It returns default geo polygons.
     * 
     * TODO: provide a GeoJSON manager.
     */
    public getPolygons(): any {
        if(!this.polygons) {
            this.polygons = countryPolygons;
        }
        return this.polygons;
    }

    /**
     * It returns default geo centroids.
     * 
     * TODO: provide a GeoJSON manager.
     */
    public getCentroids(): any {
        if(!this.centroids) {
            this.centroids = countryCentroids;
        }
        return this.centroids;
    }

    /**
     * It returns default global state variables.
     */
    public getGlobals(): IMapGlobals {
        return {
            zoom: this.getZoom(),
            mapCenter: this.getMapCenter(),
            mapStructure: this.getMapStructure(),
        };
    }

    /**
     * It returns default zoom level.
     */
    public getZoom(): number {
        return 2;
    }

    /**
     * It returns default center coordinates in Leaflet map.
     */
    public getMapCenter(): { lat: number, lng: number } {
        return {
            lat: 50,
            lng: -0.1
        };
    }

    /**
     * It returns the map structure defined with respect to the leaflet library.
     */
    public getMapStructure(): { maxZoom: number, maxBounds: [[ number,number ],[ number,number ]] } {
        return {
            maxZoom: 10,
            maxBounds: [[-100,-400],[2000,400]]
        };
    }
}
export default GeovistoMapDefaults;
