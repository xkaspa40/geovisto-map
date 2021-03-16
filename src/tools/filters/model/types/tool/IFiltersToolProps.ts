import IMapToolProps from "../../../../../model/types/tool/IMapToolProps";
import IMapFiltersManager from "../filter/IMapFilterManager";
import IMapFilterRule from "../filter/IMapFilterRule";

/**
 * This interface provide specification of the filters tool props model.
 * 
 * @author Jiri Hynek
 */
interface IFiltersToolProps extends IMapToolProps {
    manager: IMapFiltersManager | undefined;
    rules: IMapFilterRule[] | undefined;
}
export default IFiltersToolProps;