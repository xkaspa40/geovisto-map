import IMapTool from "../../../../../model/types/tool/IMapTool";
import ISidebarTabControl from "../../../../sidebar/model/types/tab/ISidebarTabControl";
import IFiltersToolProps from "./IFiltersToolProps";
import IFiltersToolDefaults from "./IFiltersToolDefaults";
import IFiltersToolState from "./IFiltersToolState";
import IMapFilterRule from "../filter/IMapFilterRule";

/**
 * This interface declares the  filter tool.
 * It provides methods for filters management.
 * 
 * @author Jiri Hynek
 */
interface IFiltersTool extends IMapTool {

    /**
     * It creates a copy of the uninitialized tool.
     */
    copy(): IFiltersTool;

    /**
     * It returns the props given by the programmer.
     */
    getProps(): IFiltersToolProps;

    /**
     * It returns default values of the state properties.
     */
    getDefaults(): IFiltersToolDefaults;

    /**
     * It returns the sidebar tool state.
     */
    getState(): IFiltersToolState;

    /**
     * It updates filter rules and notifies listeners.
     * 
     * @param filterRules 
     */
    setFilterRules(filterRules: IMapFilterRule[]): void;
}
export default IFiltersTool;