import IMapToolProps from "../abstract/IMapToolProps";
import IMapEvent from "../../event/abstract/IMapEvent";
import IMapToolDefaults from "../abstract/IMapToolDefaults";
import IMapTool from "../abstract/IMapTool";
import IMapToolState from "../abstract/IMapToolState";
import IMap from "../../map/abstract/IMap";
import IMapToolConfig from "../abstract/IMapToolConfig";
import MapObject from "../../object/generic/MapObject";
import MapToolDefaults from "./MapToolDefaults";
import MapToolState from "./MapToolState";

/**
 * This class provides basic tools API.
 * 
 * @author Jiri Hynek
 */
class MapTool extends MapObject implements IMapTool {

    /**
     * It initializes the tool.
     */
    constructor(props: IMapToolProps) {
        super(props);
    }

    /**
     * It creates copy of the uninitialized tool.
     */
    public copy(): IMapTool {
        return new MapTool(this.getProps());
    }

    /**
     * Help function which returns the props given by the programmer.
     */
    public getProps(): IMapToolProps {
        return this.getProps();
    }

    /**
     * It returns default values of the state properties.
     */
    public getDefaults(): IMapToolDefaults {
        return <IMapToolDefaults> super.getDefaults();
    }

    /**
     * It creates new defaults of the tool.
     */
    protected createDefaults(): IMapToolDefaults {
        return new MapToolDefaults(this);
    }

    /**
     * It returns the map tool state.
     */
    public getState(): IMapToolState {
        return <IMapToolState> super.getState();
    }

    /**
     * It returns default state of the tool which is used when no state is specified.
     */
    protected createState() {
        return new MapToolState(this);
    }

    /**
     * Help getter which returns a logtical value whether the tool type is singleton.
     */
    public isSingleton(): boolean {
       return this.getDefaults().isSingleton(); 
    }

    /**
     * It initializes the tool before it is created.
     * It processes the serialized config and sets the Geovisto map which manages the tools.
     * 
     * This cannot be done in the tool constructor
     * since the tool can be created before the Geovisto map is created.
     * 
     * This cannot be done in the tool create function
     * since there can be possible dependencies between the tools
     * (the tool might depend on other tools which needs to be initialized).
     * 
     * @param {GeovistoMap} map
     * @param {IMapToolConfig | undefined} config
     */
    public initialize(map: IMap, config: IMapToolConfig | undefined): void {
        // the map should not be undefined (this function is called only by GeovistoMap)
        this.getState().setMap(map);
        
        // override state by Geovisto config if specified in argument - this can happen only if:
        // 1) the config of the same id was found
        // 2) the tool was created as a copy of the generic tool (generic config)
        this.setConfig(config != undefined ? config : this.getDefaults().getConfig());
    }

    /**
     * Help function returns map which uses this tool.
     * 
     * Do not override this function. Use the state class instead.
     * 
     * @returns {CombinedMap}
     */
    public getMap(): IMap {
        return this.getState().getMap();
    }

    /**
     * It creates a tool.
     * 
     * Override this function.
     */
    public create(): void {
    }

    /**
     * Help getter which returns enabled property of state.
     * 
     * Do not override this function. Use the state class instead.
     */
    public isEnabled(): boolean {
        return this.getState().isEnabled();
    }

    /**
     * Some tools might be dynamicaly enabled/disabled.
     * This function is called externally when the tool is enabled/disabled.
     * 
     * Override this function, if needed.
     * 
     * @param {boolean} enabled 
     */
    public setEnabled(enabled: boolean) : void {
        if(this.isEnabled() != enabled) {
            this.getState().setEnabled(enabled);
        }
    }

    /**
     * Help function which switches enabled state (enabled/disabled).
     * 
     * Do not override this function. Use setEnabled instead.
     */
    public switchEnabled(): void {
        // update settings
        this.setEnabled(!this.isEnabled());
    }

    /**
     * This function is called when a custom event is invoked.
     * 
     * Override this function, if needed.
     * 
     * @param {IMapEvent} event
     */
    public handleEvent(event: IMapEvent): void {
    }
}
export default MapTool;