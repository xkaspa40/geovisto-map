import ISidebarFragment from "./ISidebarFragment";

/**
 * This interface declares functions
 * which needs to be implemented when
 * a tool wants to provide a sidebar fragment.
 * 
 * @author Jiri Hynek
 */
interface ISidebarTabControl {

    /**
     * It returns a sidebar fragment.
     */
    getSidebarTabFragment(): ISidebarFragment;
}
export default ISidebarTabControl;