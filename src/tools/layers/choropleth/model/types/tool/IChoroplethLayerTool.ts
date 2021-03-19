import ILayerTool from "../../../../../../model/types/layer/ILayerTool";
import IChoroplethLayerToolDefaults from "./IChoroplethLayerToolDefaults";
import IChoroplethLayerToolState from "./IChoroplethLayerToolState";

/**
 * This interface declares the choropleth layer tool.
 * 
 * @author Jiri Hynek
 */
interface IChoroplethLayerTool extends ILayerTool {

    /**
     * It creates a copy of the uninitialized tool.
     */
    copy(): IChoroplethLayerTool;

    /**
     * It creates new defaults of the tool.
     */
    getDefaults(): IChoroplethLayerToolDefaults;

    /**
     * It returns default tool state.
     */
    getState(): IChoroplethLayerToolState;

}

export default IChoroplethLayerTool;