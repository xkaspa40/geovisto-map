import AbstractLayerTool from "./AbstractLayerTool";
import ILayerTool from "../../types/layer/ILayerTool";
import MapToolDefaults from "../tool/MapToolDefaults";
import ILayerToolDefaults from "../../types/layer/ILayerToolDefaults";
import ILayerToolDimensions from "../../types/layer/ILayerToolDimensions";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class LayerToolDefaults extends MapToolDefaults implements ILayerToolDefaults {

    /**
     * It initializes the tool defaults.
     */
    public constructor(tool: ILayerTool) {
        super(tool);
    }

    /**
     * It returns a unique type string of the tool which is based on the layer it wraps.
     */
    public getType(): string {
        return AbstractLayerTool.TYPE();
    }

    /**
     * It returns the layer name.
     */
    public getLayerName(): string {
        return "Abstract layer";
    }

    /**
     * It returns the default layer tool dimensions.
     */
    public getDimensions(): ILayerToolDimensions {
        return {};
    }
}
export default LayerToolDefaults;