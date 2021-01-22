import AbstractTool from "../abstract/AbstractTool";
import AbstractToolsManager from "../abstract/AbstractToolsManager";

/**
 * This class provide functions for using tools.
 * 
 * @author Jiri Hynek
 */
class ToolsManager extends AbstractToolsManager {

    constructor(tools) {
        super();
        this.tools = tools;
    }

    /**
     * The function returns available tools.
     */
    getObjects() {
        return this.tools;
    }

    /**
     * It returns copy of the tools manager with copies of tools.
     */
    copy() {
        // we use copies of predefined tools due to later multiple imports of configs
        let toolsCopy = [];
        let tools = this.getObjects();
        for(let i = 0; i < tools.length; i++) {
            toolsCopy.push(tools[i].copy());
        }
        return new ToolsManager(toolsCopy);
    }

    /**
     * It adds tool to the list of tools.
     * 
     * @param {AbstractTool} tool 
     */
    add(tool) {
        this.tools.push(tool);
    }

    /**
     * It removes tool from the list of tools.
     * 
     * @param {AbstractTool} tool 
     */
    remove(tool) {
        this.tools = this.tools.filter(item => item != tool);
    }

    /**
     * It removes tool from the list of tools.
     * 
     * @param {string} id 
     */
    removeById(id) {
        this.tools = this.tools.filter(item => item.getId() != id);
    }
}
export default ToolsManager;