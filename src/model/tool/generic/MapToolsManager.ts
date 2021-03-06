import MapObjectsManager from "../../object/generic/MapObjectsManager";
import IMapToolsManager from "../abstract/IMapToolsManager";
import IMapTool from "../abstract/IMapTool";

/**
 * This class provide functions for using tools.
 * 
 * @author Jiri Hynek
 */
class MapToolsManager extends MapObjectsManager implements IMapToolsManager {

    constructor(tools: IMapTool[]) {
        super(tools);
    }

    /**
     * The function returns available tools.
     */
    public getObjects(): IMapTool[] {
        return <IMapTool[]> super.getObjects();
    }

    /**
     * It returns copy of the tools manager with copies of tools.
     */
    public copy(): IMapToolsManager {
        // we use copies of predefined tools due to later multiple imports of configs
        let toolsCopy = [];
        let tools = this.getObjects();
        for(let i = 0; i < tools.length; i++) {
            toolsCopy.push(tools[i].copy());
        }
        return new MapToolsManager(toolsCopy);
    }
}
export default MapToolsManager;