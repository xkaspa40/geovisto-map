import IMapChangeEvent from "../../../../../model/types/event/IMapChangeEvent";
import IMapSelection from "../selection/IMapSelection";
import IMapTool from "../../../../../model/types/tool/IMapTool";

/**
 * This class provides the map selection change event.
 * 
 * @author Jiri Hynek
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ISelectionToolEvent extends IMapChangeEvent<IMapTool, IMapSelection> {
}
export default ISelectionToolEvent;