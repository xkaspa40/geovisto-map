import IMapObject from "../../object/abstract/IMapObject";
import IMapToolDefaults from "./IMapToolDefaults";
import IMapToolState from "./IMapToolState";
import IMapToolConfig from "./IMapToolConfig";
import IMap from "../../map/abstract/IMap";
import IMapEvent from "../../event/abstract/IMapEvent";
import IMapToolProps from "./IMapToolProps";

/**
 * This class provide functions for using map tool which can be identified by uniquie string.
 * 
 * @author Jiri Hynek
 */
interface IMapTool extends IMapObject {

    /**
     * It creates copy of the uninitialized tool.
     */
    copy(): IMapTool;

    /**
     * It returns the props given by the programmer.
     */
    getProps(): IMapToolProps;

    /**
     * It returns default values of the state properties.
     */
    getDefaults(): IMapToolDefaults;

    /**
     * It returns the map tool state.
     */
    getState(): IMapToolState;

    /**
     * It returns a logical value whether the tool type is singleton.
     */
    isSingleton(): boolean;

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
     * @param {IMap} map
     * @param {IMapToolConfig} config 
     */
    initialize(map: IMap, config: IMapToolConfig | undefined): void;

    /**
     * Help function which returns map which uses this tool.
     */
    getMap(): IMap;

    /**
     * It creates a tool.
     */
    create(): void;

    /**
     * Help getter which returns enabled property of state.
     */
    isEnabled(): boolean

    /**
     * Some tools might be dynamicaly enabled/disabled.
     * This function is called externally when the tool is enabled/disabled.
     * 
     * @param {boolean} enabled 
     */
    setEnabled(enabled: boolean): void

    /**
     * Help function which switches the enabled state (enabled/disabled).
     */
    switchEnabled(): void;

    /**
     * This function is called when a custom event is invoked.
     * 
     * @param {IMapEvent} event
     */
    handleEvent(event: IMapEvent): void;
}
export default IMapTool;