import AbstractMapObjectDefaults from "../../../../model/object/abstract/AbstractMapObjectDefaults";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class AbstractTabFragmentDefaults extends AbstractMapObjectDefaults {

    /**
     * It initializes a map defaults.
     */
    constructor() {
        super();
    }

    /**
     * It returns a unique type string of the sidebar fragment.
     */
    getType() {
        return "geovisto-sidebar-fragment";
    }

    /**
     * It returns whether the tab control is enabled.
     */
    isEnabled() {
        return true;
    }

    /**
     * It returns the default config.
     */
    getConfig() {
        return {};
    }
}
export default AbstractTabFragmentDefaults;