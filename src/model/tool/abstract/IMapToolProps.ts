import IMapObjectProps from "../../object/abstract/IMapObjectProps";

/**
 * This class provide specification of map tool props model.
 * 
 * @author Jiri Hynek
 */
interface IMapToolProps extends IMapObjectProps {
    enabled: boolean | undefined
}
export default IMapToolProps;