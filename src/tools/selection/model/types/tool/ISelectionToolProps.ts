import IMapToolProps from "../../../../../model/types/tool/IMapToolProps";
import IMapSelection from "../selection/IMapSelection";

/**
 * This interface provide specification of the selection tool props model.
 * 
 * @author Jiri Hynek
 */
interface ISelectionToolProps extends IMapToolProps {
    selection: IMapSelection | undefined;
}
export default ISelectionToolProps;