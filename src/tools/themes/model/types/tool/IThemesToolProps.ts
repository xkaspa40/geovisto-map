import IMapToolProps from "../../../../../model/types/tool/IMapToolProps";
import IMapThemesManager from "../theme/IMapThemesManager";
import IMapTheme from "../theme/IMapTheme";

/**
 * This interface provide specification of the themes tool props model.
 * 
 * @author Jiri Hynek
 */
interface IThemesToolProps extends IMapToolProps {
    manager: IMapThemesManager | undefined;
    theme: IMapTheme | undefined;
}
export default IThemesToolProps;