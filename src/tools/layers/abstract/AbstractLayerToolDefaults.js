import AbstractToolDefaults from "../../../model/tool/abstract/AbstractToolDefaults";
import AbstractLayerTool from "./AbstractLayerTool";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class AbstractLayerToolDefaults extends AbstractToolDefaults {

    /**
     * It initializes tool defaults.
     */
    constructor() {
        super();
    }

    /**
     * It returns a unique type string of the tool which is based on the layer it wraps.
     */
    getType() {
        return AbstractLayerTool.TYPE();
    }

    /**
     * It returns the layer name.
     */
    getLayerName() {
        return "Abstract layer";
    }

    /**
     * It returns the default mapping of data domains to chart dimensions.
     */
    getDataMapping() {
        return undefined;
    }

    /**
     * It returns the data mapping model.
     */
    getDataMappingModel() {
        return undefined;
    }
}
export default AbstractLayerToolDefaults;