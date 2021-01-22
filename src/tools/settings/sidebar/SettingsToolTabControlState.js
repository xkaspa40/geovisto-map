import AbstractTabControlState from "../../sidebar/model/control/AbstractTabControlState";

/**
 * This class manages the state of the sidebar tab.
 * It wraps the state since the sidebar tab can work with state objects which needs to be explicitly serialized.
 * 
 * @author Jiri Hynek
 */
class SettingsToolTabControlState extends AbstractTabControlState {

    /**
     * It creates a tab control state.
     */
    constructor() {
        super();
    }
}
export default SettingsToolTabControlState;