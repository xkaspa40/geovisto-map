import AbstractToolState from "./AbstractToolState";
import AbstractEvent from "../../event/abstract/AbstractEvent";
import AbstractMapObject from "../../object/abstract/AbstractMapObject";
import AbstractToolDefaults from "./AbstractToolDefaults";

/**
 * This class provides basic tools API.
 * 
 * @author Jiri Hynek
 */
class AbstractTool extends AbstractMapObject {

    /**
     * It initializes the tool.
     */
    constructor(props) {
        super(props);
    }

    /**
     * It creates copy of the uninitialized tool.
     * 
     * Override this function.
     */
    copy() {
        return new AbstractTool(this.getProps());
    }

    /**
     * It creates new defaults of the tool.
     */
    createDefaults() {
        return new AbstractToolDefaults();
    }

    /**
     * It returns default state of the tool which is used when no state is specified.
     */
    createState() {
        return new AbstractToolState();
    }

    /**
     * Help getter which returns a logtical value whether the tool type is singleton.
     */
    isSingleton() {
       return this.getDefaults().isSingleton(); 
    }

    /**
     * Help getter which returns enabled property of state.
     * 
     * Do not override this function. Use the state class instead.
     */
    isEnabled() {
        return this.getState().isEnabled();
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
     * @param {any} config 
     */
    initialize(map, config) {
        // the map should not be undefined (this function is called only by GeovistoMap)
        this.getState().setMap(map);

        // it initializes map-related variables
        this.getState().resetMapVariables(map, this.getDefaults());
        
        // override state by Geovisto config if specified in argument - this can happen only if:
        // 1) the config of the same id was found
        // 2) the tool was created as a copy of the generic tool (generic config)
        this.getState().deserialize(config != undefined ? config : this.getDefaults().getConfig());
    }

    /**
     * Help function returns map which uses this tool.
     * 
     * Do not override this function. Use the state class instead.
     * 
     * @returns {CombinedMap}
     */
    getMap() {
        return this.getState().getMap();
    }

    /**
     * It creates a tool.
     * 
     * Override this function.
     */
    create() {
    }

    /**
     * Some tools might be dynamicaly enabled/disabled.
     * This function is called externally when the tool is enabled/disabled.
     * 
     * Override this function, if needed.
     * 
     * @param {boolean} enabled 
     */
    setEnabled(enabled) {
        if(this.isEnabled() != enabled) {
            this.getState().setEnabled(enabled);
        }
    }

    /**
     * Help function which switches enabled state (enabled/disabled).
     * 
     * Do not override this function. Use set enabled instead.
     */
    switchEnabled() {
        // update settings
        this.setEnabled(!this.enabled);
    }

    /**
     * This function is called when a custom event is invoked.
     * 
     * Override this function, if needed.
     * 
     * @param {AbstractEvent} event
     */
    handleEvent(event) {
    }
}
export default AbstractTool;