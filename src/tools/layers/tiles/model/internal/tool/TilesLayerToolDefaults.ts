import LayerToolDefaults from "../../../../../../model/internal/layer/LayerToolDefaults";
import ITilesLayerToolDefaults from "../../types/tool/ITilesLayerToolDefaults";
import ITilesLayerTool from "../../types/tool/ITilesLayerTool";
import TilesLayerTool from "./TilesLayerTool";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class TilesLayerToolDefaults extends LayerToolDefaults implements ITilesLayerToolDefaults {

    /**
     * It initializes tool defaults.
     */
    public constructor(tool: ITilesLayerTool) {
        super(tool);
    }

    /**
     * It returns a unique type string of the tool which is based on the layer it wraps.
     */
    public getType(): string {
        return TilesLayerTool.TYPE();
    }

    /**
     * It returns the layer name.
     */
    public getLayerName(): string {
        return "Map layer";
    }

    /**
     * It returns the preferred base map.
     */
    public getBaseMap(): string {
        return 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
    }
}
export default TilesLayerToolDefaults;