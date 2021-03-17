import LayerToolState from "../../../../../../model/internal/layer/LayerToolState";
import ITilesLayerToolState from "../../types/tool/ITilesLayerToolState";
import ITilesLayerTool from "../../types/tool/ITilesLayerTool";
import ITilesLayerToolProps from "../../types/tool/ITilesLayerToolProps";
import ITilesLayerToolDefaults from "../../types/tool/ITilesLayerToolDefaults";
import ITilesLayerToolConfig from "../../types/tool/ITilesLayerToolConfig";

/**
 * This class provide functions for using the state of the tiles layer tool.
 * 
 * @author Jiri Hynek
 */
class TilesLayerToolState extends LayerToolState implements ITilesLayerToolState {
    
    private baseMap: string;
    private layer: L.TileLayer | undefined;

    /**
     * It creates a tool state.
     */
    public constructor(tool: ITilesLayerTool) {
        super(tool);

        const props = <ITilesLayerToolProps> this.getProps();
        const defaults = <ITilesLayerToolDefaults> this.getDefaults();

        this.baseMap = props.baseMap == undefined ? defaults.getBaseMap() : props.baseMap;
    }

    /**
     * It resets state with respect to initial props.
     */
    public reset(): void {
        super.reset();

        const props = <ITilesLayerToolProps> this.getProps();
        const defaults = <ITilesLayerToolDefaults> this.getDefaults();

        // the map layer tool properties
        this.setBaseMap(props.baseMap == undefined ? defaults.getBaseMap() : props.baseMap);
    }

    /**
     * The metod takes config and deserializes the values.
     * 
     * @param config 
     */
    public deserialize(config: ITilesLayerToolConfig): void {
        super.deserialize(config);

        // the map layer tool config
        // TODO
    }

    /**
     * The method serializes the tool state. Optionally, defaults can be set if property is undefined.
     * 
     * @param filterDefaults
     */
    public serialize(filterDefaults: boolean): ITilesLayerToolConfig {
        const config: ITilesLayerToolConfig = <ITilesLayerToolConfig> super.serialize(filterDefaults);

        // serialize the map layer tool properties
        // TODO

        return config;
    }

    /**
     * It returns a base map ID.
     */
    public getBaseMap(): string {
        return this.baseMap;
    }

    /**
     * It sets a base map ID.
     * 
     * @param baseMap
     */
    public setBaseMap(baseMap: string): void {
        this.baseMap = baseMap;
    }

    /**
     * It returns a Leaflet tile layer.
     */
    public getTileLayer(): L.TileLayer | undefined {
        return this.layer;
    }

    /**
     * It sets a Leaflet tile layer.
     * 
     * @param layer 
     */
    public setTileLayer(layer: L.TileLayer): void {
        this.layer = layer;
    }
}
export default TilesLayerToolState;