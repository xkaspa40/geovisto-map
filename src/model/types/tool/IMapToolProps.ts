import IMapObjectProps from "../object/IMapObjectProps";

/**
 * This interface provide specification of map tool props model.
 * 
 * @author Jiri Hynek
 */
interface IMapToolProps extends IMapObjectProps {
    enabled: boolean | undefined
}
export default IMapToolProps;