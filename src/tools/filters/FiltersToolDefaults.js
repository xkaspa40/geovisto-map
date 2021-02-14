import FiltersManager from "./model/generic/FiltersManager";
import EqFilterOperation from "./model/basic/EqFilterOperation";
import NeqFilterOperation from "./model/basic/NeqFilterOperation";
import RegFilterOperation from "./model/basic/RegFilterOperation";
import AbstractToolDefaults from "../../model/tool/abstract/AbstractToolDefaults";
import FiltersTool from "./FiltersTool";
import LessThanFilterOperation from "./model/basic/LessThanFilterOperation";
import GreaterThanEqualFilterOperation from "./model/basic/GreaterThanEqualFilterOperation";
import GreaterThanFilterOperation from "./model/basic/GreaterThanFilterOperation";

/**
 * This class provide functions which return the default state values.
 *
 * @author Jiri Hynek
 */
class FiltersToolDefaults extends AbstractToolDefaults {

    /**
     * It creates tool defaults.
     */
    constructor() {
        super();
    }

    /**
     * Only one filter tool should be present in the Geovisto map.
     */
    isSingleton() {
        return true;
    }

    /**
     * It returns a unique string of the tool type.
     */
    getType() {
        return FiltersTool.TYPE();
    }

    /**
     * It returns default filters manager.
     */
    getFiltersManager() {
        return new FiltersManager([
            new EqFilterOperation(),
            new NeqFilterOperation(),
            new RegFilterOperation(),
            new LessThanFilterOperation(),
            new GreaterThanEqualFilterOperation(),
            new GreaterThanFilterOperation(),
        ]);
    }

    /**
     * It returns default filter rules.
     */
    getFilterRules() {
        return [];
    }
}

export default FiltersToolDefaults;
