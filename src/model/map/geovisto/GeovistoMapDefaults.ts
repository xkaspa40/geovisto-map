import IMapDefaults from "../abstract/IMapDefaults";
import IMap from "../abstract/IMap";
import IMapConfig from "../abstract/IMapConfig";
import IMapConfigManager from "../../config/abstract/IMapConfigManager";
import IMapTemplates from "../abstract/IMapTemplates";
import IMapToolsManager from "../../tool/abstract/IMapToolsManager";
import IMapDataManager from "../../data/abstract/IMapDataManager";
import IMapGlobals from "../abstract/IMapGlobals";

import MapObjectDefaults from "../../object/generic/MapObjectDefaults";
import MapToolsManager from "../../tool/generic/MapToolsManager";
import SidebarTool from "../../../tools/sidebar/SidebarTool";
import FiltersTool from "../../../tools/filters/FiltersTool";
import SettingsTool from "../../../tools/settings/SettingsTool";
import MapConfigManager from "../../config/basic/MapConfigManager";
import MapLayerTool from "../../../tools/layers/map/MapLayerTool";
import ChoroplethLayerTool from "../../../tools/layers/choropleth/ChoroplethLayerTool";
import MarkerLayerTool from "../../../tools/layers/marker/MarkerLayerTool";
import ConnectionLayerTool from "../../../tools/layers/connection/ConnectionLayerTool";
import ThemesTool from "../../../tools/themes/ThemesTool";
import SelectionTool from "../../../tools/selection/SelectionTool";
import GeovistoMap from "./GeovistoMap";
import JsonMapDataManager from "../../data/json/JsonMapDataManager";

import countryCentroids from '../../../../static/geo/country_centroids.json';
import countryPolygons from '../../../../static/geo/country_polygons.json';

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
    constructor(map: IMap) {
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
    getToolTemplates(): MapToolsManager {
        return new MapToolsManager([
            new SidebarTool(),
            new SettingsTool(),
            new FiltersTool(),
            new ThemesTool(),
            new SelectionTool(),
            new MapLayerTool(),
            new ChoroplethLayerTool({ zindex: 350 }),
            new MarkerLayerTool(),
            new ConnectionLayerTool(),
        ]);
    }

    /**
     * It returns a default tools manager containing used tools.
     */
    getTools(): IMapToolsManager {
        return new MapToolsManager([]);
    }

    /**
     * It returns default map data manager.
     */
    getMapData(): IMapDataManager {
        return new JsonMapDataManager([]);
    }

    /**
     * It returns default geo polygons.
     * 
     * TODO: provide a GeoJSON manager.
     */
    getPolygons(): object {
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
    getCentroids(): object {
        if(!this.centroids) {
            this.centroids = countryCentroids;
        }
        return this.centroids;
    }

    /**
     * It returns default global state variables.
     */
    getGlobals(): IMapGlobals {
        return {
            zoom: this.getZoom(),
            mapCenter: this.getMapCenter(),
            mapStructure: this.getMapStructure(),
        };
    }

    /**
     * It returns default zoom level.
     */
    getZoom(): number {
        return 2;
    }

    /**
     * It returns default center coordinates in Leaflet map.
     */
    getMapCenter(): { lat: number, lng: number } {
        return {
            lat: 50,
            lng: -0.1
        };
    }

    /**
     * It returns the map structure defined with respect to the leaflet library.
     */
    getMapStructure(): { maxZoom: number, maxBounds: [[ number,number ],[ number,number ]] } {
        return {
            maxZoom: 10,
            maxBounds: [[-100,-400],[2000,400]]
        };
    }
}
export default GeovistoMapDefaults;
