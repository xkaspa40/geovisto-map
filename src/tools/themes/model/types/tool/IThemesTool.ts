import IMapTool from "../../../../../model/types/tool/IMapTool";
import ISidebarFragmentControl from "../../../../sidebar/model/types/fragment/ISidebarFragmentControl";
import IThemesToolDefaults from "./IThemesToolDefaults";
import IThemesToolProps from "./IThemesToolProps";
import IThemesToolState from "./IThemesToolState";

/**
 * This interface provides the themes tool.
 * 
 * @author Jiri Hynek
 */
interface IThemesTool extends IMapTool, ISidebarFragmentControl {

    /**
     * It creates a copy of the uninitialized tool.
     */
    copy(): IThemesTool;

    /**
     * It returns the props given by the programmer.
     */
    getProps(): IThemesToolProps;

    /**
     * It returns default values of the state properties.
     */
    getDefaults(): IThemesToolDefaults;

    /**
     * It returns the sidebar tool state.
     */
    getState(): IThemesToolState;

    /**
     * @param {IThemesTool} theme 
     */
    setTheme(theme: IThemesTool): void
}
export default IThemesTool;