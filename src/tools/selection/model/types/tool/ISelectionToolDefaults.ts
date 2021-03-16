import IMapToolDefaults from "../../../../../model/types/tool/IMapToolDefaults";
import IMapSelection from "../selection/IMapSelection";
import ISelectionToolConfig from "./ISelectionToolConfig";

/**
 * This interface declares functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
interface ISelectionToolDefaults extends IMapToolDefaults {

    /**
     * It returns default config if no config is given.
     */
    getConfig(): ISelectionToolConfig;

    /**
     * It returns default map selection.
     */
    getSelection(): IMapSelection | null;
}
export default ISelectionToolDefaults;