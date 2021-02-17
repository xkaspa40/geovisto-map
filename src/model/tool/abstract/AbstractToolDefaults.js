import AbstractMapObjectDefaults from "../../object/abstract/AbstractMapObjectDefaults";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class AbstractToolDefaults extends AbstractMapObjectDefaults {

    /**
     * It creates tool defaults.
     */
    constructor() {
        super();
    }

    /**
     * It returns a logical value whether the tool type is singleton.
     */
    isSingleton() {
       return false; 
    }

    /**
     * By default, the tool is enabled.
     * 
     * @param {boolean} enabled 
     */
    isEnabled() {
        return true;
    }

    /**
     * It returns default config if no config is given.
     */
    getConfig() {
        return {};
    }
}
export default AbstractToolDefaults;