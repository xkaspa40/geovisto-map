import ISidebarTab from "./ISidebarTab";

/**
 * This interface declares functions
 * which needs to be implemented when
 * a tool wants to provide a sidebar tab.
 * 
 * @author Jiri Hynek
 */
interface ISidebarTabControl {

    /**
     * It returns a sidebar tab.
     */
    getSidebarTab(): ISidebarTab;
}
export default ISidebarTabControl;