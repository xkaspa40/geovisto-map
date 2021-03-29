import MapObjectDefaults from "../object/MapObjectDefaults";
import IMapTool from "../../types/tool/IMapTool";
import IMapToolDefaults from "../../types/tool/IMapToolDefaults";
import IMapToolConfig from "../../types/tool/IMapToolConfig";
import JsonMapDataManager from "../data/json/JsonMapDataManager";
import IMapDataManager from "../../types/data/IMapDataManager";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class MapToolDefaults extends MapObjectDefaults implements IMapToolDefaults {

    /**
     * It creates tool defaults.
     */
    public constructor(tool : IMapTool) {
        super(tool);
    }

    /**
     * It reurns map tool
     */
    public getMapObject(): IMapTool {
        return <IMapTool> super.getMapObject();
    }

    /**
     * It returns default map data manager.
     */
    public getDataManager(): IMapDataManager {
        return (this.getMapObject().getMap()?.getState().getMapData())?? new JsonMapDataManager([]);
    }

    /**
     * By defaults it returns the config with undefined props.
     */
    public getConfig(): IMapToolConfig {
        const config = <IMapToolConfig> super.getConfig();
        config.enabled = undefined;
        return config;
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