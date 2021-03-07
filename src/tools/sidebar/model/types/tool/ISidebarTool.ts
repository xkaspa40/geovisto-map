import IMapTool from '../../../../../model/types/tool/IMapTool';
import ISidebarToolDefaults from './ISidebarToolDefaults';
import ISidebarToolProps from './ISidebarToolProps';
import ISidebarToolState from "./ISidebarToolState";

/**
 * This class provides the sidebar tool.
 *
 * @author Jiri Hynek
 */
interface ISidebarTool extends IMapTool {

    /**
     * It creates a copy of the uninitialized tool.
     */
    copy(): ISidebarTool;

    /**
     * It returns the props given by the programmer.
     */
    getProps(): ISidebarToolProps;

    /**
     * It returns default values of the state properties.
     */
    getDefaults(): ISidebarToolDefaults;

    /**
     * It returns the sidebar tool state.
     */
    getState(): ISidebarToolState;
}
export default ISidebarTool;
