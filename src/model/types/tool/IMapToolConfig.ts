import IMapObjectConfig from "../object/IMapObjectConfig";

/**
 * This interface provides specification of map tool config model.
 * 
 * It contains only basic data types.
 * 
 * @author Jiri Hynek
 */
interface IMapToolConfig extends IMapObjectConfig {
    type: string | undefined;
    enabled: boolean | undefined;
}
export default IMapToolConfig;