import AbstractTabControlDefaults from "../../../../sidebar/model/internal/control/AbstractTabControlDefaults";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class SettingsToolTabControlDefaults extends AbstractTabControlDefaults {

    /**
     * It creates tab control defaults.
     */
    constructor() {
        super();
    }

    /**
     * It returns name of tab pane.
     */
    getName() {
        return "General settings";
    }

    /**
     * It returns the icon of the tab pane.
     */
    getIcon() {
        return '<i class="fa fa-gear"></i>';
    }

    /**
     * The settings tab control does not contain a check button used to enable/disable the tool.
     */
    getCheckButton() {
        return false;
    }
}
export default SettingsToolTabControlDefaults;