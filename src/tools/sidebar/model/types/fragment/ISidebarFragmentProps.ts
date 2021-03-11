import IMapObjectProps from "../../../../../model/types/object/IMapObjectProps";
import IMapTool from "../../../../../model/types/tool/IMapTool";

/**
 * This interface provides specification of sidebar fragment props model.
 * 
 * @author Jiri Hynek
 */
interface ISidebarFragmentProps extends IMapObjectProps {
    enabled: boolean | undefined;
    tool: IMapTool;
}
export default ISidebarFragmentProps;