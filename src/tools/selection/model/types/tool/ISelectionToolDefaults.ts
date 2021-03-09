import ISelectionTool from "./ISelectionTool";
import IMapToolDefaults from "../../../../../model/types/tool/IMapToolDefaults";
import ISidebarFragmentControl from "../../../../sidebar/model/types/fragment/ISidebarFragmentControl";
import IMapSelection from "../selection/IMapSelection";
import ISelectionToolConfig from "./ISelectionToolConfig";

/**
 * This interface declares functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
interface ISelectionToolDefaults extends IMapToolDefaults, ISidebarFragmentControl {

    /**
     * It returns default config if no config is given.
     */
    getConfig(): ISelectionToolConfig;

    /**
     * It returns default map selection.
     */
    getSelection(): IMapSelection;
}
export default ISelectionToolDefaults;