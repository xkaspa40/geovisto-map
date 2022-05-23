import AbstractLayerToolTabControlDefaults from "../../abstract/sidebar/AbstractLayerToolTabControlDefaults";


/**
 * This class provide functions which return the default state values.
 * 
 * @author Petr Kaspar
 */
class SpikeLayerToolTabControlDefaults extends AbstractLayerToolTabControlDefaults {

    /**
     * It creates tab control defaults.
     */
    constructor() {
        super();
    }

    /**
     * It returns the icon of the tab pane.
     */
    getIcon() {
        return '<i class="fa fa-arrow-up"></i>';
    }
}
export default SpikeLayerToolTabControlDefaults;