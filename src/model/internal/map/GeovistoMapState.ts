import MapObjectState from "../object/MapObjectState";
import IMapState from "../../types/map/IMapState";
import IMap from "../../types/map/IMap";
import IMapProps from "../../types/map/IMapProps";
import IMapDefaults from "../../types/map/IMapDefaults";
import IMapTemplates from "../../types/map/IMapTemplates";
import IMapGlobals from "../../types/map/IMapGlobals";
import IMapConfig from "../../types/map/IMapConfig";
import IMapToolsManager from "../../types/tool/IMapToolsManager";
import IMapTool from "../../types/tool/IMapTool";
import IMapToolConfig from "../../types/tool/IMapToolConfig";
import IMapDataManager from "../../types/data/IMapDataManager";
import IMapConfigManager from "../../types/config/IMapConfigManager";

/**
 * This class manages state of the map.
 * It wraps the state since the map can work with state objects which needs to be explicitly serialized.
 * 
 * @author Jiri Hynek
 */
class GeovistoMapState extends MapObjectState implements IMapState {
    
    private map: L.Map | undefined;
    private tools: IMapToolsManager;
    private toolTemplates: IMapToolsManager;
    private mapData: IMapDataManager;
    private data: any[];
    private mapConfig: IMapConfigManager;
    private polygons: any;
    private centroids: any;
    private zoom: number;
    private mapCenter: { lat: number; lng: number; };
    private mapStructure: { maxZoom: number; maxBounds: [[number, number], [number, number]]; };

    /**
     * It initializes a map state.
     * 
     * @param map 
     */
    public constructor(map: IMap) {
        super(map);

        const props = <IMapProps> this.getProps();
        const defaults = <IMapDefaults> this.getDefaults();

        this.mapConfig = defaults.getConfigManager();

        // templates
        const templates: IMapTemplates = props.templates == undefined ? defaults.getTemplates() : props.templates;
        this.toolTemplates = (templates.tools == undefined ? defaults.getToolTemplates() : templates.tools);

        // tools
        this.tools = props.tools == undefined ? defaults.getTools() : props.tools;

        // data
        this.mapData = props.data == undefined ? defaults.getMapData() : props.data;
        this.data = this.mapData.getDataRecords();

        // geo data - TODO convert to generic geo data
        this.polygons = props.polygons == undefined ? defaults.getPolygons() : props.polygons;
        this.centroids = props.centroids == undefined ? defaults.getCentroids() : props.centroids;

        // globals (state variables which are common for all geovisto tools) - can be undefined and set by initialize function
        const globals: IMapGlobals = props.globals == undefined ? defaults.getGlobals() : props.globals;
        this.zoom = globals.zoom == undefined ? defaults.getZoom() : globals.zoom;
        this.mapCenter = globals.mapCenter == undefined ? defaults.getMapCenter() : globals.mapCenter;
        this.mapStructure = globals.mapStructure == undefined ? defaults.getMapStructure() : globals.mapStructure;
    }

    /**
     * It resets state with respect to initial props.
     */
    public reset(): void {
        super.reset();
        
        const props = <IMapProps> this.getProps();
        const defaults = <IMapDefaults> this.getDefaults();

        // templates
        const templates: IMapTemplates = props.templates == undefined ? defaults.getTemplates() : props.templates;
        this.setToolTemplates(templates.tools == undefined ? defaults.getToolTemplates() : templates.tools);

        // tools
        this.setTools(props.tools == undefined ? defaults.getTools() : props.tools);

        // data
        this.setMapData(props.data == undefined ? defaults.getMapData() : props.data);

        // geo data - TODO convert to generic geo data
        this.setPolygons(props.polygons == undefined ? defaults.getPolygons() : props.polygons);
        this.setCentroids(props.centroids == undefined ? defaults.getCentroids() : props.centroids);

        // globals (state variables which are common for all geovisto tools) - can be undefined and set by initialize function
        const globals: IMapGlobals = props.globals == undefined ? defaults.getGlobals() : props.globals;
        this.setInitialZoom(globals.zoom == undefined ? defaults.getZoom() : globals.zoom);
        this.setInitialMapCenter(globals.mapCenter == undefined ? defaults.getMapCenter() : globals.mapCenter);
        this.setInitialMapStructure(globals.mapStructure == undefined ? defaults.getMapStructure() : globals.mapStructure);
    }

    /**
     * It takes config and deserializes the values.
     * 
     * @param config
     */
    public deserialize(config: IMapConfig): void {
        super.deserialize(config);

        if(config.zoom != undefined) this.setInitialZoom(config.zoom);
        if(config.mapCenter != undefined) this.setInitialMapCenter(config.mapCenter);
        if(config.mapStructure != undefined) this.setInitialMapStructure(config.mapStructure);
    }

    /**
     * It serializes the map state. Optionally, a serialized value can be let undefined if it equals the default value.
     * 
     * @param filterDefaults 
     */
    public serialize(filterDefaults: boolean | undefined): IMapConfig {
        const defaults: IMapDefaults = <IMapDefaults> this.getDefaults();
        const map: L.Map | undefined = this.getLeafletMap();

        // initialize config
        // do not serialize the id and type for map
        //let config = super.serialize(defaults);
        const config: IMapConfig = {
            id: undefined,
            type: undefined,
            zoom: filterDefaults && map?.getZoom() == defaults.getZoom() ? undefined : map?.getZoom(),
            mapCenter: filterDefaults && map?.getCenter() == defaults.getMapCenter() ? undefined : map?.getCenter(),
            mapStructure: undefined, // TODO map structure
            tools: undefined // see the code below
        };

        // serialize tools
        const tools: IMapTool[] = this.getTools().getAll();
        const toolsConfigs: IMapToolConfig[] = [];
        for (let i = 0; i < tools.length; i++) {
            toolsConfigs.push(tools[i].getState().serialize(false));
        }
        config.tools = toolsConfigs;

        return config;
    }

    /**
     * It returns the Leaflet map.
     */
    public getLeafletMap(): L.Map | undefined {
        return this.map;
    }

    /**
     * It returns the Leaflet map.
     * 
     * TODO: specify the type
     * 
     * @param map 
     */
    public setLeafletMap(map: L.Map): void {
        this.map = map;
    }

    /**
     * It returns the tool manager providing tool templates.
     */
    public getToolTemplates(): IMapToolsManager {
        return this.toolTemplates;
    }

    /**
     * It sets tool templates providing tool templates.
     * 
     * @param toolTemplates 
     */
    public setToolTemplates(toolTemplates: IMapToolsManager): void {
        this.toolTemplates = toolTemplates;
    }

    /**
     * It returns tools manager providing tools.
     */
    public getTools(): IMapToolsManager {
        return this.tools;
    }

    /**
     * It sets tools manager providing tools.
     * 
     * @param tools 
     */
    public setTools(tools: IMapToolsManager): void {
        // we use copies of predefined tools due to later multiple imports of configs
        this.tools = tools.copy();
    }

    /**
     * It returns the map data manager.
     */
    public getMapData(): IMapDataManager {
        return this.mapData;
    }

    /**
     * It sets the map data manager.
     * note: It also updates the current data.
     * 
     * @param mapData 
     */
    public setMapData(mapData: IMapDataManager): void {
        this.mapData = mapData;
        this.setCurrentData(mapData.getDataRecords());
    }

    /**
     * It returns current data (might be filtered).
     * 
     * TODO: specify the type
     */
    public getCurrentData(): any[] {
        return this.data;
    }

    /**
     * It sets current data.
     * 
     * TODO: specify the type
     * 
     * @param data
     */
    public setCurrentData(data: any[]): void {
        this.data = data;
    }

    /**
     * It returns the map config manager.
     */
    public getMapConfig(): IMapConfigManager {
        return this.mapConfig;
    }

    /**
     * It sets the map config manager.
     * 
     * @param mapData 
     */
    public setMapConfig(mapConfig: IMapConfigManager): void {
        this.mapConfig = mapConfig;
    }

    /**
     * It returns polygons.
     * 
     * TODO: specify the type
     */
    public getPolygons(): any {
        return this.polygons;
    }

    /**
     * It sets polygons.
     * 
     * TODO: specify the type
     * 
     * @param polygons
     */
    public setPolygons(polygons: any): void {
        return this.polygons = polygons;
    }

    /**
     * It returns centroids.
     * 
     * TODO: specify the type
     */
    public getCentroids(): any {
        return this.centroids;
    }

    /**
     * It sets centroids.
     * 
     * TODO: specify the type
     * 
     * @param centroids
     */
    public setCentroids(centroids: any): void {
        return this.centroids = centroids;
    }

    /**
     * It returns the initial zoom level.
     */
    public getInitialZoom(): number {
        return this.zoom;
    }

    /**
     * It sets initial zoom level.
     * 
     * @param zoom
     */
    public setInitialZoom(zoom: number): void {
        this.zoom = zoom;
    }

    /**
     * It returns the initial map center.
     * 
     * TODO: remove from state (use defaults only)
     */
    public getInitialMapCenter(): { lat: number, lng: number } {
        return this.mapCenter;
    }

    /**
     * It sets initial map center.
     * 
     * TODO: remove from state (use defaults only)
     * 
     * @param mapCenter
     */
    public setInitialMapCenter(mapCenter: { lat: number, lng: number }): void {
        this.mapCenter = mapCenter;
    }

    /**
     * It returns the initial structure.
     * 
     * TODO: remove from state (use defaults only)
     */
    public getInitialMapStructure(): { maxZoom: number, maxBounds: [[ number,number ],[ number,number ]] } {
        return this.mapStructure;
    }

    /**
     * It sets initial map structure.
     * 
     * TODO: remove from state (use defaults only)
     * 
     * @param mapStructure
     */
    public setInitialMapStructure(mapStructure: { maxZoom: number, maxBounds: [[ number,number ],[ number,number ]] }): void {
        this.mapStructure = mapStructure;
    }
}
export default GeovistoMapState;