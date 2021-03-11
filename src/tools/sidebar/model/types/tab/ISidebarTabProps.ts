import IMapObjectProps from "../../../../../model/types/object/IMapObjectProps";
import IMapTool from "../../../../../model/types/tool/IMapTool";

/**
 * This interface provides specification of sidebar fragment props model.
 * 
 * @author Jiri Hynek
 */
interface ISidebarTabProps extends IMapObjectProps {
    enabled: boolean | undefined;
    name: string | undefined;
    icon: string | undefined;
    checkButton: boolean | undefined;
    tool: IMapTool;
}
export default ISidebarTabProps;