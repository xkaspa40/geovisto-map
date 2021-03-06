import IMapObjectConfig from "../../object/abstract/IMapObjectConfig";
import IMapToolConfig from "../../tool/abstract/IMapToolConfig";

/**
 * This class provide specification of map config model.
 * 
 * It contains only basic data types
 * 
 * @author Jiri Hynek
 */
interface IMapConfig extends IMapObjectConfig {
    zoom: number | undefined;
    mapCenter: { lat: number, lng: number } | undefined;
    mapStructure: { maxZoom: number, maxBounds: [[ number,number ],[ number,number ]] } | undefined;
    tools: IMapToolConfig[] | undefined;
}
export default IMapConfig;