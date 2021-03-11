import SidebarTabState from "../../../../sidebar/model/internal/tab/SidebarTabState";

/**
 * This class manages the state of the sidebar tab.
 * It wraps the state since the sidebar tab can work with state objects which needs to be explicitly serialized.
 * 
 * @author Jiri Hynek
 */
class SettingsToolTabControlState extends SidebarTabState {

    /**
     * It creates a tab control state.
     */
    constructor() {
        super();
    }
}
export default SettingsToolTabControlState;