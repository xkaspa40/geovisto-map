import AbstractMapManager from "../../object/abstract/AbstractMapObjectsManager";

/**
 * This class provide functions for using tools.
 * 
 * @author Jiri Hynek
 */
class AbstractToolsManager extends AbstractMapManager {

    /**
     * It initializes the tools manager.
     */
    constructor() {
        super();
    }

    /**
     * It returns copy of the tools manager with copies of tools.
     */
    copy() {
        return new AbstractToolsManager();
    }
}
export default AbstractToolsManager;