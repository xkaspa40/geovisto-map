import IMapObjectProps from "../../object/abstract/IMapObjectProps";
import IMapTemplates from "./IMapTemplates";
import IMapGlobals from "./IMapGlobals";
import IMapDataManager from "../../data/abstract/IMapDataManager";
import IMapToolsManager from "../../tool/abstract/IMapToolsManager";

/**
 * This class provide specification of map props model.
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