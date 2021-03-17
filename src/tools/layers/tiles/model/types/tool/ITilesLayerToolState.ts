import LayerToolState from "../../../../../../model/internal/layer/LayerToolState";
import ITilesLayerToolConfig from "./ITilesLayerToolConfig";

/**
 * This interface declares functions for using the state of the layer tool.
 * 
 * @author Jiri Hynek
 */
interface ITilesLayerToolState extends LayerToolState {

    /**
     * The metod takes config and deserializes the values.
     * 
     * @param config 
     */
    deserialize(config: ITilesLayerToolConfig): void;

    /**
     * The method serializes the tool state. Optionally, defaults can be set if property is undefined.
     * 
     * @param filterDefaults
     */
    serialize(filterDefaults: boolean): ITilesLayerToolConfig;

    /**
     * It returns a base map ID.
     */
    getBaseMap(): string;

    /**
     * It sets a base map ID.
     * 
     * @param baseMap
     */
    setBaseMap(baseMap: string): void;

    /**
     * It returns a Leaflet tile layer.
     */
    getTileLayer(): L.TileLayer | undefined;

    /**
     * It sets a Leaflet tile layer.
     * 
     * @param layer 
     */
    setTileLayer(layer: L.TileLayer): void;
}
export default ITilesLayerToolState;