import IMapObjectConfig from "../object/IMapObjectConfig";
import IMapToolConfig from "../tool/IMapToolConfig";

/**
 * This interface provides specification of map config model.
 * 
 * It contains only basic data types.
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