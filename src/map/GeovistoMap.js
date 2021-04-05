import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/common.scss';
import AbstractMapObject from "../model/object/abstract/AbstractMapObject";
import AbstractEvent from '../model/event/abstract/AbstractEvent';
import DataChangeEvent from '../model/event/basic/DataChangeEvent';
import GeovistoMapDefaults from './GeovistoMapDefaults';
import GeovistoMapState from './GeovistoMapState';

/**
 * Representation of map wrapper which handles map layers, sidebar and other tools
 * 
 * @author Jiri Hynek
 */
class GeovistoMap extends AbstractMapObject {

    /**
     * Initializes object.
     * 
     * @param {*} props 
     */
    constructor(props) {
        super(props);
    }

    /**
     * It creates new defaults of the object.
     */
    createDefaults() {
        return new GeovistoMapDefaults();
    }

    /**
     * It creates new state if the object.
     */
    createState() {
        return new GeovistoMapState();
    }

    /**
     * The function draws a new map.
     */
    draw(mapConfig) {
        // reset variables, use defaults
        this.getState().reset(this.getDefaults());

        // initialize map and tools
        this.initialize(mapConfig);

        // render map and tools
        this.create();
    }

    /**
     * This function redraws the current map.
     */
    redraw(mapConfig, props) {
        // get map and remove map children
        let mapContainer = document.getElementById(this.getState().getId());
        if(mapContainer && mapContainer.childNodes.length > 0) {
            mapContainer.childNodes[0].remove();
        }

        // creates a new state with a new props
        if(props) {
            this.state = this.createState();
            this.state.initialize(props, this.getDefaults());
        } else {
            this.state.reset(this.getDefaults());
        }

        // initialize map and tools
        this.initialize(mapConfig);

        // render map and tools
        this.create();
    }
  
    /**
     * Resets variables.
     */
    initialize(mapConfig) {
        mapConfig = mapConfig == undefined ? this.getDefaults().getConfig() : mapConfig;
        this.getState().setMapConfig(mapConfig);

        // override state by Geovisto config if specified in argument
        // this also initializes child map objects - e.g., tools
        this.getState().deserialize(mapConfig.getConfig());

        // initialize existing tools
        let toolsManager = this.getState().getTools();
        if(!toolsManager.isEmpty()) {
            // a) tool is already created, initialize them and try to find their config
            let tools = toolsManager.getObjects();
            for(let i = 0; i < tools.length; i++) {
                // initialize tool (provide map and config)
                tools[i].initialize(this, mapConfig.getToolConfig(tools[i].getId()));
            }
        }
        
        // deserialize remaining tools with respect to the config
        let toolsConfigs = mapConfig.getToolsConfigs();
        if(toolsConfigs != undefined) {
            let toolTemplatesManager = this.getState().getToolTemplates();
            let tool;
            let toolConfig;
            for(let i = 0; i < toolsConfigs.length; i++) {
                toolConfig = toolsConfigs[i];

                // filter already initialized tools
                if(toolConfig.id != undefined) {
                    tool = toolsManager.getById(toolConfig.id);
                    if(tool != undefined) {
                        continue;
                    }
                }

                // b) tool has not been created yet, use config and tool template to create the tool
                let toolTemplates = toolTemplatesManager.getByType(toolConfig.type);
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

                // if there is no template, the tool config is ignored
            }
        }
    }

    /**
     * It exports the serialized representation of the current state of the map.
     */
    export() {
        return this.getState().getMapConfig().export(this.getState().serialize(this.getDefaults()));
    }

    /**
     * This function creates Geovisto map - it creates map container, leaflet map and tools.
     */
    create() {
        // create new map container (DOM element)
        this.createMapContainer();

        // create Leaflet map
        this.createMap();

        // create tools
        this.createTools();
    }

    /**
     * This function creates the map container.
     */
    createMapContainer() {
        let mapContainer = document.getElementById(this.getState().getId()).appendChild(document.createElement("div"));
        mapContainer.setAttribute("id", this.getContainerId())
        mapContainer.setAttribute("class", this.getContainerClass())
        
        return mapContainer;
    }

    /**
     * The type of the object.
     */
    static TYPE() {
        // important! CSS styles use this name!
        return "geovisto-map";
    }

    /**
     * It returns ID of the map container.
     */
    getContainerId() {
        return this.getId() + "-container";
    }

    /**
     * It returns class of the map container.
     */
    getContainerClass() {
        return this.getType() + "-container";
    }

    /**
     * Creates the leaflet-based map with respect to the configuration.
     */
    createMap() {
        let state = this.getState();
        let map = L
        .map(this.getContainerId(), state.getInitialMapStructure())
        .setView(
            state.getInitialMapCenter(),
            state.getInitialZoom()
        );

        // add attribution
        map.attributionControl.addAttribution(this.getMapAttribution());

        this.getState().setLeafletMap(map);
        this.map = map;

        return this.map;
    }

    /**
     * This function serves tools as a means to register handlers for generic map events such as 'zoom'
     *
     * @param type      type of event
     * @param handler   event handler
     */
    addEventListener(type, handler) {
        this.map.on(type, (e) => handler(e));
    }

    /**
     * It returns the map attribution.
     * 
     * This function can be overriden;
     */
    getMapAttribution() {
        return '<a href="https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson">GeoJSON</a>';
    }

    /**
     * This function creates map tools.
     */
    createTools() {
        // create tools
        let tools = this.getState().getTools().getObjects();
        for(let i = 0; i < tools.length; i++) {
            // create tool
            tools[i].create();
        }
    }

    /**
     * It updates data and invokes listeners.
     * 
     * @param {[any]} data
     * @param {*} source of the change
     */
    updateData(data, source) {
        // update state
        this.getState().setCurrentData(data);

        // create and dispatch event
        this.dispatchEvent(new DataChangeEvent(source, data));
    }
    
    /**
     * It sends custom event to all listeners (tools)
     * 
     * @param {AbstractEvent} event 
     */
    dispatchEvent(event) {
        console.log("event: " + event.getType(), event);
        // notify listeners
        let tools = this.getState().getTools().getObjects();
        for(let i = 0; i < tools.length; i++) {
            tools[i].handleEvent(event);
        }
    }
};

export default GeovistoMap;
