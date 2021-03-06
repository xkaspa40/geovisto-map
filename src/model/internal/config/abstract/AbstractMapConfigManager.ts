import IMapConfig from "../../../types/map/IMapConfig";
import IMapToolConfig from "../../../types/tool/IMapToolConfig";

/**
 * The class wraps config used by the map and functions to acquire config items.
 * 
 * @author Jiri Hynek
 */
abstract class AbstractMapConfigManager {
    
    private originalConfig: any;
    private config: IMapConfig;

    /**
     * It initializes the config wrapper providing a basic API.
     * It expects a config represented by the implicict Geovisto map structure.
     * 
     * @param {any} config 
     */
    constructor(config: any) {
        this.originalConfig = config;
        this.config = this.import(config);
    }

    /**
     * It converts given config to the internal map config structure.
     * 
     * @param {any} mapConfing 
     */
    protected abstract import(config: any): IMapConfig;

    /**
     * It converts map config to the original structure.
     * 
     * @param {IMapConfig} mapConfing 
     */
    public abstract export(mapConfig: IMapConfig): any;

    /**
     * It returns the original config.
     */
    public getOriginalConfig(): any {
        return this.originalConfig;
    }

    /**
     * It returns the map config
     */
    public getMapConfig(): IMapConfig {
        return this.config;
    }

    /**
     * It returns the list of all config records for the tools.
     */
    public getToolsConfigs(): IMapToolConfig[] {
        return this.config.tools;
    }

    /**
     * It returns the config record for the tool identified by the given tool identifier.
     * 
     * @param {string} toolId 
     */
    public getToolConfig(toolId: string): IMapToolConfig | undefined {
        let tools = this.config.tools
        let tool = undefined;
        if(tools != undefined && Array.isArray(tools)) {
            tool = tools.find(x => x.id == toolId);
        }
        return tool;
    }
}
export default AbstractMapConfigManager;