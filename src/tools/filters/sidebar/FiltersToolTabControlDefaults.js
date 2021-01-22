import AbstractTabControlDefaults from "../../sidebar/model/control/AbstractTabControlDefaults";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class FiltersToolTabControlDefaults extends AbstractTabControlDefaults {

    /**
     * It initializes sidebar tab control defaults.
     */
    constructor() {
        super();
    }

    /**
     * It returns name of tab pane.
     */
    getName() {
        return "Filters";
    }

    /**
     * It returns the icon of the tab pane.
     */
    getIcon() {
        return '<i class="fa fa-filter"></i>';
    }

    /**
     * It returns the element class.
     */
    getFilterRuleElementClass() {
        return this.getMapObject().getType() + "-filter";
    }
}
export default FiltersToolTabControlDefaults;
