import AbstractMapObjectDefaults from "../model/object/abstract/AbstractMapObjectDefaults";
import ToolsManager from "../model/tool/generic/ToolsManager";
import SidebarTool from "../tools/sidebar/SidebarTool";
import FiltersTool from "../tools/filters/FiltersTool";
import SettingsTool from "../tools/settings/SettingsTool";
import BasicMapConfig from "../model/config/basic/BasicMapConfig";
import MapLayerTool from "../tools/layers/map/MapLayerTool";
import ChoroplethLayerTool from "../tools/layers/choropleth/ChoroplethLayerTool";
import MarkerLayerTool from "../tools/layers/marker/MarkerLayerTool";
import ConnectionLayerTool from "../tools/layers/connection/ConnectionLayerTool";
import ThemesTool from "../tools/themes/ThemesTool";
import SelectionTool from "../tools/selection/SelectionTool";
import GeovistoMap from "./GeovistoMap";

import countryCentroids from '../../static/geo/country_centroids.json';
import countryPolygons from '../../static/geo/country_polygons.json';

/**
 * This class provide functions which return the default state values.
 *
 * @author Jiri Hynek
 */
class GeovistoMapDefaults extends AbstractMapObjectDefaults {

    /**
     * It creates map defaults.
     */
    constructor() {
        super();
    }

    /**
     * It returns a unique type string of the object.
     */
    getType() {
        return GeovistoMap.TYPE();
    }

    /**
     * It returns default managers.
     *
     * This function can be overriden;
     */
    getTemplates() {
        return {
            tools: this.getToolTemplates(),
        };
    }

    /**
     * It returns default tools manager.
     *
     * This function can be overriden;
     */
    getToolTemplates() {
        return new ToolsManager([
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
     * It returns a default tools manager.
     */
    getTools() {
        return new ToolsManager([]);
    }

    /**
     * It returns default map config.
     */
    getMapData() {
        return new FlattenedMapData([]);
    }

    /**
     * It returns default geo polygons.
     */
    getPolygons() {
        if(!this.polygons) {
            this.polygons = countryPolygons;
        }
        return this.polygons;
    }

    /**
     * It returns default geo centroids.
     */
    getCentroids() {
        if(!this.centroids) {
            this.centroids = countryCentroids;
        }
        return this.centroids;
    }

    /**
     * It returns default global state variables.
     */
    getGlobals() {
        return {
            zoom: this.getZoom(),
            mapCenter: this.getMapCenter(),
            mapStructure: this.getMapStructure(),
        };
    }

    /**
     * It returns default zoom level.
     */
    getZoom() {
        return 2;
    }

    /**
     * It returns default center coordinates in Leaflet map.
     */
    getMapCenter() {
        return {
            lat: 50,
            lng: -0.1
        };
    }

    /**
     * It returns the map structure defined with respect to the leaflet library.
     */
    getMapStructure() {
        return {
            maxZoom: 10,
            maxBounds: [[-100,-400],[2000,400]]
        };
    }

    /**
     * It returns default map config.
     */
    getConfig() {
        return new BasicMapConfig({});
    }
}
export default GeovistoMapDefaults;
