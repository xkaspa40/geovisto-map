import ILayerTool from "../../../../../../model/types/layer/ILayerTool";
import ITilesLayerToolDefaults from "./ITilesLayerToolDefaults";
import ITilesLayerToolState from "./ITilesLayerToolState";

/**
 * This interface declares Tiles layer tool.
 * 
 * @author Jiri Hynek
 */
interface ITilesLayerTool extends ILayerTool {

    /**
     * It creates a copy of the uninitialized tool.
     */
    copy(): ILayerTool;

    /**
     * It creates new defaults of the tool.
     */
    getDefaults(): ITilesLayerToolDefaults;

    /**
     * It returns default tool state.
     */
    getState(): ITilesLayerToolState;
}

export default ITilesLayerTool;