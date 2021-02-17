import AbstractTabControlDefaults from "../../../sidebar/model/control/AbstractTabControlDefaults";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class AbstractLayerToolTabControlDefaults extends AbstractTabControlDefaults {

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
        return this.getMapObject().getState().getTool().getState().getLayerName() + " settings";
    }

    /**
     * It returns the icon of the tab pane.
     */
    getIcon() {
        return '<i class="fa fa-file"></i>';
    }

    /**
     * It returns the data mapping model.
     */
    getDataMappingModel() {
        return this.getMapObject().getTool().getDefaults().getDataMappingModel();
    }
}
export default AbstractLayerToolTabControlDefaults;