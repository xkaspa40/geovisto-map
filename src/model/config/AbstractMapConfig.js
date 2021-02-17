/**
 * The class wraps config used by the map and functions to acquire config items.
 * 
 * @author Jiri Hynek
 */
class AbstractMapConfig {

    /**
     * It initializes the config wrapper providing a basic API.
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
        return this.config;
    }

    /**
     * It returns map config transformed for Geovisto map.
     * 
     * {
     *   "zoom": number,
     *   "center": {
     *     "lat": number,
     *     "lng": number
     *   },
     *   tools: [
     *     {
     *       "id": string,
     *       ...
     *     },
     *     ...
     *   ]
     * }
     */
    getConfig() {
        return this.config;
    }

    /**
     * It returns the list of all config records for the tools.
     */
    getToolsConfigs() {
        return {};
    }

    /**
     * It returns the config record for the tool identified by the given tool identifier.
     * 
     * @param {string} toolId 
     */
    getToolConfig(toolId) {
        return {};
    }

    /**
     * It provides possibility to transform config to particular structure.
     * 
     * @param {*} mapConfing 
     */
    export(mapConfing) {
        return mapConfing;
    }

}
export default AbstractMapConfig;