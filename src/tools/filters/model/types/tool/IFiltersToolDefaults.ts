import FiltersManager from "../filter/generic/FiltersManager";
import EqFilterOperation from "../filter/basic/EqFilterOperation";
import NeqFilterOperation from "../filter/basic/NeqFilterOperation";
import RegFilterOperation from "../filter/basic/RegFilterOperation";
import AbstractToolDefaults from "../../model/tool/abstract/AbstractToolDefaults";
import FiltersTool from "./IFiltersTool";

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
            new RegFilterOperation()
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