/**
 * The class wraps config used by the map and functions to acquire config items.
 * 
 * @author Jiri Hynek
 */
class BasicMapConfig {

    /**
     * It initializes the config wrapper providing a basic API.
     * It expects a config represented by the implicict Geovisto map structure.
     * 
     * @param {any} config 
     */
    constructor(config) {
        this.config = config;
    }

    /**
     * It returns original map config.
     */
    getOriginalConfig() {
        return super.getOriginalConfig();
    }

    /**
     * It returns original map config since it is represented in the implicit geovisto map structure.
     */
    getConfig() {
        return this.config;
    }

    /**
     * It returns the list of all config records for the tools.
     */
    getToolsConfigs() {
        return this.config.tools;
    }

    /**
     * It returns the config record for the tool identified by the given tool identifier.
     * 
     * @param {string} toolId 
     */
    getToolConfig(toolId) {
        let tools = this.config.tools
        let tool = undefined;
        if(tools != undefined && Array.isArray(tools)) {
            tool = tools.find(x => x.id == toolId);
        }
        return tool;
    }

    /**
     * It returns map config of the implicit structure.
     * 
     * @param {*} mapConfing 
     */
    export(mapConfig) {
        return mapConfig;
    }

}
export default BasicMapConfig;