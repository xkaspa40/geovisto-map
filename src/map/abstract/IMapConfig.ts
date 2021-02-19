import IMapObjectConfig from "../../model/object/abstract/IMapObjectConfig";
import IMapToolConfig from "../../model/tool/abstract/IMapToolConfig";

/**
 * This class provide specification of map config model.
 * 
 * It contains only basic data types
 * 
 * @author Jiri Hynek
 */
interface IMapConfig extends IMapObjectConfig {
    tools: IMapToolConfig[];
}
export default IMapConfig;