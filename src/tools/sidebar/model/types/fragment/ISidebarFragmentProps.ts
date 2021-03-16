import IMapObjectProps from "../../../../../model/types/object/IMapObjectProps";

/**
 * This interface provides specification of sidebar fragment props model.
 * 
 * @author Jiri Hynek
 */
interface ISidebarFragmentProps extends IMapObjectProps {
    enabled: boolean | undefined;
}
export default ISidebarFragmentProps;