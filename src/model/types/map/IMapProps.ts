import IMapObjectProps from "../object/IMapObjectProps";
import IMapTemplates from "./IMapTemplates";
import IMapGlobals from "./IMapGlobals";
import IMapDataManager from "../data/IMapDataManager";
import IMapToolsManager from "../tool/IMapToolsManager";

/**
 * This interface provide specification of map props model.
 * 
 * @author Jiri Hynek
 */
interface IMapProps extends IMapObjectProps {
    templates: IMapTemplates | undefined;
    globals: IMapGlobals | undefined;
    data: IMapDataManager | undefined;
    tools: IMapToolsManager | undefined;
    centroids: any;
    polygons: any;
}
export default IMapProps;