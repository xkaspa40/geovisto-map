import IMapConfig from "../map/IMapConfig";
import IMapToolConfig from "../tool/IMapToolConfig";

/**
 * The interface declares config used by the map and functions to acquire config items.
 * 
 * @author Jiri Hynek
 */
interface IMapConfigManager {

    /**
     * It returns the original config.
     */
    getOriginalConfig(): any;

    /**
     * It returns the map config.
     */
    getMapConfig(): IMapConfig;

    /**
     * It returns the list of all config records for the tools.
     */
    getToolsConfigs(): IMapToolConfig[];

    /**
     * It returns the config record for the tool identified by the given tool identifier.
     * 
     * @param {string} toolId 
     */
    getToolConfig(toolId: string): IMapToolConfig | undefined;

    /**
     * It provides possibility to transform given config to the original structure.
     * 
     * @param {*} mapConfing 
     */
    export(mapConfing: IMapConfig): any;
}
export default IMapConfigManager;