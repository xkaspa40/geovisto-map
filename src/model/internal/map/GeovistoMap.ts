import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// TODO - move to index.ts
import '../../../styles/common.scss';

import DataChangeEvent from '../event/data/DataChangeEvent';
import GeovistoMapDefaults from './GeovistoMapDefaults';
import GeovistoMapState from './GeovistoMapState';
import MapObject from '../object/MapObject';
import IMapProps from '../../types/map/IMapProps';
import IMapDefaults from '../../types/map/IMapDefaults';
import IMapState from '../../types/map/IMapState';
import IMapConfigManager from '../../types/config/IMapConfigManager';
import IMapToolsManager from '../../types/tool/IMapToolsManager';
import IMapToolConfig from '../../types/tool/IMapToolConfig';
import IMapTool from '../../types/tool/IMapTool';
import IMap from '../../types/map/IMap';
import IMapEvent from '../../types/event/IMapEvent';
import IMapObject from '../../types/object/IMapObject';

/**
 * Representation of map wrapper which handles map layers, sidebar and other tools
 * 
 * @author Jiri Hynek
 */
class GeovistoMap extends MapObject implements IMap {

    /**
     * Initializes object.
     * 
     * @param props 
     */
    public constructor(props: IMapProps) {
        super(props);
    }

    /**
     * The type of the object.
     */
    public static TYPE(): string {
        // important! CSS styles use this name!
        return "geovisto-map";
    }

    /**
     * It returns object defaults as the map defaults.
     */
    public getDefaults(): IMapDefaults {
        return <IMapDefaults> super.getDefaults();
    }

    /**
     * It creates new defaults of the object.
     */
    public createDefaults(): IMapDefaults {
        return new GeovistoMapDefaults(this);
    }

    /**
     * It returns object state as the map state.
     */
    public getState(): IMapState {
        return <IMapState> super.getState();
    }

    /**
     * It creates new state if the object.
     */
    public createState(): IMapState {
        return new GeovistoMapState(this);
    }

    /**
     * The function draws a new map.
     */
    public draw(mapConfig: IMapConfigManager): HTMLElement | null {
        // reset variables, use defaults
        this.getState().reset();

        // initialize map and tools
        this.initialize(mapConfig);

        // render map and tools
        return this.create();
    }

    /**
     * This function redraws the current map.
     */
    public redraw(mapConfig: IMapConfigManager, props: IMapProps): HTMLElement | null {
        // get map and remove map children
        const mapContainer: HTMLElement | null = document.getElementById(this.getState().getId());
        if(mapContainer && mapContainer.childNodes.length > 0) {
            // remove old elements
            mapContainer.childNodes[0].remove();

            // creates a new state with a new props
            // TODO remove the props argument
            /*if(props) {
                this.state = this.createState();
                this.getState().initialize(props, this.getDefaults());
            } else {
                this.state.reset(this.getDefaults());
            }*/
            this.getState().reset();

            // initialize map and tools
            this.initialize(mapConfig);

            // render map and tools
            return this.create();
        }
        return mapContainer;
    }
  
    /**
     * Resets variables.
     */
    protected initialize(mapConfig: IMapConfigManager | undefined): void {
        mapConfig = mapConfig == undefined ? this.getDefaults().getConfigManager() : mapConfig;
        this.getState().setMapConfig(mapConfig);

        // override state by Geovisto config if specified in argument
        // this also initializes child map objects - e.g., tools
        this.getState().deserialize(mapConfig.getMapConfig());

        // initialize existing tools
        const toolsManager: IMapToolsManager = this.getState().getTools();
        if(!toolsManager.isEmpty()) {
            // a) tool is already created, initialize them and try to find their config
            const tools: IMapTool[] = toolsManager.getAll();
            for(let i = 0; i < tools.length; i++) {
                // initialize tool (provide map and config)
                tools[i].initialize(this, mapConfig.getToolConfig(tools[i].getId()));
            }
        }
        
        // deserialize remaining tools with respect to the config
        const toolsConfigs: IMapToolConfig[] | undefined = mapConfig.getToolsConfigs();
        if(toolsConfigs != undefined) {
            const toolTemplatesManager: IMapToolsManager = this.getState().getToolTemplates();
            let tool: IMapTool | undefined;
            let toolConfig: IMapToolConfig;
            for(let i = 0; i < toolsConfigs.length; i++) {
                toolConfig = toolsConfigs[i];

                // filter already initialized tools
                if(toolConfig.id) {
                    tool = <IMapTool> toolsManager.getById(toolConfig.id);
                    if(tool) {
                        continue;
                    }
                }

                // b) tool has not been created yet, use config and tool template to create the tool
                if(toolConfig.type) {
                    const toolTemplates: IMapTool[] = <IMapTool[]> toolTemplatesManager.getByType(toolConfig.type);
                    if(toolTemplates.length > 0) {
                        // filter singleton duplicates
                        if(toolTemplates[0].isSingleton() && toolsManager.getByType(toolConfig.type).length > 0) {
                            continue;
                        }
                        // create copy of the tool template
                        tool = toolTemplates[0].copy();
                        // initialize tool
                        tool.initialize(this, toolConfig);
                        // add to the list of tools
                        toolsManager.add(tool);
                    }
                }

                // if there is no template, the tool config is ignored
            }
        }
    }

    /**
     * It exports the serialized representation of the current state of the map.
     */
    public export(): any {
        return this.getState().getMapConfig().export(this.getState().serialize(true));
    }

    /**
     * This function creates Geovisto map - it creates map container, leaflet map and tools.
     */
    protected create(): HTMLElement | null {
        const mapContainer: HTMLElement | null = this.createMapContainer();

        // create new map container (DOM element)
        if(mapContainer) {
            // create Leaflet map
            if(this.createMap()) {
                // create tools
                this.createTools();
            }
        }

        return mapContainer;
    }

    /**
     * This function creates the map container.
     */
    protected createMapContainer(): HTMLElement | null {
        const mapContainer: HTMLElement | null = document.getElementById(this.getState().getId());
        if(mapContainer) {
            mapContainer.appendChild(document.createElement("div"));
            mapContainer.setAttribute("id", this.getContainerId());
            mapContainer.setAttribute("class", this.getContainerClass());
        }
        
        return mapContainer;
    }

    /**
     * It returns ID of the map container.
     */
    protected getContainerId(): string {
        return this.getId() + "-container";
    }

    /**
     * It returns class of the map container.
     */
    protected getContainerClass(): string {
        return this.getType() + "-container";
    }

    /**
     * Creates the leaflet-based map with respect to the configuration.
     */
    protected createMap(): L.Map {
        const state: IMapState = this.getState();
        const map: L.Map = L
        .map(this.getContainerId(), state.getInitialMapStructure())
        .setView(
            state.getInitialMapCenter(),
            state.getInitialZoom()
        );

        // add attribution
        map.attributionControl.addAttribution(this.getMapAttribution());

        this.getState().setLeafletMap(map);

        return map;
    }

    /**
     * It returns the map attribution.
     * 
     * This function can be overriden;
     */
    protected getMapAttribution(): string {
        return '<a href="https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson">GeoJSON</a>';
    }

    /**
     * This function creates map tools.
     */
    protected createTools(): IMapTool[] {
        // create tools
        const tools: IMapTool[] = this.getState().getTools().getAll();
        for(let i = 0; i < tools.length; i++) {
            // create tool
            tools[i].create();
        }
        return tools;
    }

    /**
     * It updates data and invokes listeners.
     * 
     * @param data
     * @param source of the change
     */
    public updateData(data: any[], source: IMapObject): void {
        // update state
        this.getState().setCurrentData(data);

        // create and dispatch event
        this.dispatchEvent(new DataChangeEvent(source, data));
    }
    
    /**
     * It sends custom event to all listeners (tools)
     * 
     * @param event 
     */
    public dispatchEvent(event: IMapEvent): void {
        console.log("event: " + event.getType(), event);
        // notify listeners
        const tools: IMapTool[] = this.getState().getTools().getAll();
        for(let i = 0; i < tools.length; i++) {
            tools[i].handleEvent(event);
        }
    }
}
export default GeovistoMap;
