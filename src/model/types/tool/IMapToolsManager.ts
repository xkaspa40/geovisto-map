import IMapObjectsManager from "../object/IMapObjectsManager";
import IMapTool from "./IMapTool";

/**
 * This class provide functions for using tools.
 * 
 * @author Jiri Hynek
 */
interface IMapToolsManager extends IMapObjectsManager {

    /**
     * The function returns available map tools.
     */
    getObjects(): IMapTool[]

    /**
     * It returns copy of the tools manager with copies of tools.
     */
    copy(): IMapToolsManager;
}
export default IMapToolsManager;