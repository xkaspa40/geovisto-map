import AbstractMapObjectDefaults from "../../../../model/internal/object/MapObjectDefaults";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class AbstractTabControlDefaults extends AbstractMapObjectDefaults {

    /**
     * It creates map defaults.
     */
    constructor() {
        super();
    }

    /**
     * It returns a unique type string of the tool.
     */
    getType() {
        return "geovisto-sidebar-tab";
    }

    /**
     * It returns whether the tab control is enabled.
     */
    isEnabled() {
        return true;
    }

    /**
     * It returns name of tab pane.
     */
    getName() {
        return "Custom tab";
    }

    /**
     * It returns the icon of tab pane.
     */
    getIcon() {
        return '<i class="fa fa-file"></i>';
    }

    /**
     * It returns whether the tab control contains a check button used to enable/disable the tool.
     */
    getCheckButton() {
        return true;
    }

    /**
     * It returns the default config.
     */
    getConfig() {
        return {};
    }
}
export default AbstractTabControlDefaults;