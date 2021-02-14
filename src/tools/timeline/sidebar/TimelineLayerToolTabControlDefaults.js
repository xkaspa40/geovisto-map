import AbstractLayerToolTabControlDefaults
    from '../../layers/abstract/sidebar/AbstractLayerToolTabControlDefaults';

/**
 * This class provide functions which return the default state values.
 *
 * @author Jiri Hynek
 */
class TimelineLayerToolTabControlDefaults extends AbstractLayerToolTabControlDefaults {

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
        return '<i class="fa fa-clock-o" />';
    }

    /**
     * It returns name of tab pane.
     */
    getName() {
        return "Timeline";
    }
}

export default TimelineLayerToolTabControlDefaults;
