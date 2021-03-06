import MapObjectDefaults from "../../object/generic/MapObjectDefaults";
import IMapTool from "../abstract/IMapTool";
import IMapToolDefaults from "../abstract/IMapToolDefaults";
import IMapToolConfig from "../abstract/IMapToolConfig";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class MapToolDefaults extends MapObjectDefaults implements IMapToolDefaults {

    /**
     * It creates tool defaults.
     */
    constructor(tool : IMapTool) {
        super(tool);
    }

    /**
     * By defaults it returns the config with undefined props.
     */
    public getConfig(): IMapToolConfig {
        return <IMapToolConfig> super.getConfig();
    }

    /**
     * By default, the tool is singleton
     */
    public isSingleton(): boolean {
       return false; 
    }

    /**
     * By default, the tool is enabled.
     */
    public isEnabled(): boolean {
        return true;
    }
}
export default MapToolDefaults;