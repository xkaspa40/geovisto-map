import SidebarFragmentState from "../../../../sidebar/model/internal/fragment/SidebarTabFragmentState";

/**
 * This class manages the state of the sidebar fragment.
 * It wraps the state since the sidebar fragment can work with state objects which needs to be explicitly serialized.
 * 
 * @author Jiri Hynek
 */
class ThemesToolTabFragmentState extends SidebarFragmentState {

    /**
     * It creates a tab fragment state.
     */
    constructor() {
        super();
    }
}
export default ThemesToolTabFragmentState;