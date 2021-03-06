import MapObjectState from "../../object/generic/MapObjectState";
import IMapState from "../abstract/IMapState";
import IMap from "../abstract/IMap";
import IMapProps from "../abstract/IMapProps";
import IMapDefaults from "../abstract/IMapDefaults";
import IMapTemplates from "../abstract/IMapTemplates";
import IMapGlobals from "../abstract/IMapGlobals";
import IMapConfig from "../abstract/IMapConfig";
import IMapToolsManager from "../../tool/abstract/IMapToolsManager";
import IMapTool from "../../tool/abstract/IMapTool";
import IMapToolConfig from "../../tool/abstract/IMapToolConfig";
import IMapDataManager from "../../data/abstract/IMapDataManager";
import IMapConfigManager from "../../config/abstract/IMapConfigManager";

/**
 * This class manages state of the map.
 * It wraps the state since the map can work with state objects which needs to be explicitly serialized.
 * 
 * @author Jiri Hynek
 */
class GeovistoMapState extends MapObjectState implements IMapState {
    
    private map: any; // TODO: define type
    private tools: IMapToolsManager;
    private toolTemplates: IMapToolsManager;
    private mapData: IMapDataManager;
    private data: object[];
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
    constructor(map: IMap) {
        super(map);

        let props = <IMapProps> this.getProps();
        let defaults = <IMapDefaults> this.getDefaults();

        this.mapConfig = defaults.getConfigManager();

        // templates
        let templates: IMapTemplates = props.templates == undefined ? defaults.getTemplates() : props.templates;
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
        let globals: IMapGlobals = props.globals == undefined ? defaults.getGlobals() : props.globals;
        this.zoom = globals.zoom == undefined ? defaults.getZoom() : globals.zoom;
        this.mapCenter = globals.mapCenter == undefined ? defaults.getMapCenter() : globals.mapCenter;
        this.mapStructure = globals.mapStructure == undefined ? defaults.getMapStructure() : globals.mapStructure;
    }

    /**
     * It resets state with respect to initial props. Optionally, defaults can be set if property is undefined.
     */
    public reset(): void {
        super.reset();
        
        let props = <IMapProps> this.getProps();
        let defaults = <IMapDefaults> this.getDefaults();

        // templates
        let templates: IMapTemplates = props.templates == undefined ? defaults.getTemplates() : props.templates;
        this.setToolTemplates(templates.tools == undefined ? defaults.getToolTemplates() : templates.tools);

        // tools
        this.setTools(props.tools == undefined ? defaults.getTools() : props.tools);

        // data
        this.setMapData(props.data == undefined ? defaults.getMapData() : props.data);

        // geo data - TODO convert to generic geo data
        this.setPolygons(props.polygons == undefined ? defaults.getPolygons() : props.polygons);
        this.setCentroids(props.centroids == undefined ? defaults.getCentroids() : props.centroids);

        // globals (state variables which are common for all geovisto tools) - can be undefined and set by initialize function
        let globals: IMapGlobals = props.globals == undefined ? defaults.getGlobals() : props.globals;
        this.setInitialZoom(globals.zoom == undefined ? defaults.getZoom() : globals.zoom);
        this.setInitialMapCenter(globals.mapCenter == undefined ? defaults.getMapCenter() : globals.mapCenter);
        this.setInitialMapStructure(globals.mapStructure == undefined ? defaults.getMapStructure() : globals.mapStructure);
    }

    /**
     * It takes config and desrializes the values.
     * 
     * @param {IMapConfig} config
     */
    public deserialize(config: IMapConfig): void {
        super.deserialize(config);

        if(config.zoom != undefined) this.setInitialZoom(config.zoom);
        if(config.mapCenter != undefined) this.setInitialMapCenter(config.mapCenter);
        if(config.mapStructure != undefined) this.setInitialMapStructure(config.mapStructure);
    }

    /**
     * It serializes the map state. Optionally, a serialed value can be let undefined if it equals the default value.
     * 
     * @param {*} filterDefaults 
     */
    public serialize(filterDefaults: boolean | undefined): IMapConfig {
        let defaults = <IMapDefaults> this.getDefaults();
        let map = this.getLeafletMap();

        // initialize config
        // do not serialize the id and type for map
        //let config = super.serialize(defaults);
        let config: IMapConfig = {
            id: undefined,
            type: undefined,
            zoom: filterDefaults && map.getZoom() == defaults.getZoom() ? undefined : map.getZoom(),
            mapCenter: filterDefaults && map.getCenter() == defaults.getMapCenter() ? undefined : map.getCenter(),
            mapStructure: undefined, // TODO map structure
            tools: undefined // see the code below
        }

        // serialize tools
        let tools: IMapTool[] = this.getTools().getObjects();
        let toolsConfigs: IMapToolConfig[] = [];
        for (let i = 0; i < tools.length; i++) {
            toolsConfigs.push(tools[i].getState().serialize(false));
        }
        config.tools = toolsConfigs;

        return config;
    }

    /**
     * It returns the Leaflet map.
     * 
     * TODO: specify the type
     */
    public getLeafletMap(): any {
        return this.map;
    }

    /**
     * It returns the Leaflet map.
     * 
     * TODO: specify the type
     * 
     * @param {any} map 
     */
    public setLeafletMap(map: any) {
        return this.map = map;
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
     * @param {IMapToolsManager} toolTemplates 
     */
    public setToolTemplates(toolTemplates: IMapToolsManager): void {
        this.toolTemplates = toolTemplates;
    }

    /**
     * It returns tools manager providing tools.
     */
    getTools(): IMapToolsManager {
        return this.tools;
    }

    /**
     * It sets tools manager providing tools.
     * 
     * @param {IMapToolsManager} tools 
     */
    setTools(tools: IMapToolsManager): void {
        // we use copies of predefined tools due to later multiple imports of configs
        this.tools = tools.copy();
    }

    /**
     * It returns the map data manager.
     */
    getMapData(): IMapDataManager {
        return this.mapData;
    }

    /**
     * It sets the map data manager.
     * note: It also updates the current data.
     * 
     * @param {IMapDataManager} mapData 
     */
    setMapData(mapData: IMapDataManager) {
        this.mapData = mapData;
        this.setCurrentData(mapData.getDataRecords());
    }

    /**
     * It returns current data (might be filtered).
     * 
     * TODO: specify the type
     */
    getCurrentData(): object[] {
        return this.data;
    }

    /**
     * It sets current data.
     * 
     * TODO: specify the type
     * 
     * @param {object[]} data
     */
    setCurrentData(data: object[]): void {
        this.data = data;
    }

    /**
     * It returns the map config manager.
     */
    getMapConfig(): IMapConfigManager {
        return this.mapConfig;
    }

    /**
     * It sets the map config manager.
     * 
     * @param {IMapConfigManager} mapData 
     */
    setMapConfig(mapConfig: IMapConfigManager) {
        this.mapConfig = mapConfig;
    }

    /**
     * It returns polygons.
     * 
     * TODO: specify the type
     */
    getPolygons(): any {
        return this.polygons;
    }

    /**
     * It sets polygons.
     * 
     * TODO: specify the type
     * 
     * @param {any} polygons
     */
    setPolygons(polygons: any): void {
        return this.polygons = polygons;
    }

    /**
     * It returns centroids.
     * 
     * TODO: specify the type
     */
    getCentroids(): any {
        return this.centroids;
    }

    /**
     * It sets centroids.
     * 
     * TODO: specify the type
     * 
     * @param {any[]} centroids
     */
    setCentroids(centroids: any) {
        return this.centroids = centroids;
    }

    /**
     * It returns the initial zoom level.
     */
    getInitialZoom(): number {
        return this.zoom;
    }

    /**
     * It sets initial zoom level.
     * 
     * @param {number} zoom
     */
    setInitialZoom(zoom: number): void {
        this.zoom = zoom;
    }

    /**
     * It returns the initial map center.
     * 
     * TODO: remove from state (use defaults only)
     */
    getInitialMapCenter(): { lat: number, lng: number } {
        return this.mapCenter;
    }

    /**
     * It sets initial map center.
     * 
     * TODO: remove from state (use defaults only)
     * 
     * @param {*} mapCenter
     */
    setInitialMapCenter(mapCenter: { lat: number, lng: number }) {
        this.mapCenter = mapCenter;
    }

    /**
     * It returns the initial structure.
     * 
     * TODO: remove from state (use defaults only)
     */
    getInitialMapStructure(): { maxZoom: number, maxBounds: [[ number,number ],[ number,number ]] } {
        return this.mapStructure;
    }

    /**
     * It sets initial map structure.
     * 
     * TODO: remove from state (use defaults only)
     * 
     * @param {*} mapStructure
     */
    setInitialMapStructure(mapStructure: { maxZoom: number, maxBounds: [[ number,number ],[ number,number ]] }): void {
        this.mapStructure = mapStructure;
    }
}
export default GeovistoMapState;