import IMapToolState from "../tool/IMapToolState";
import ILayerToolConfig from "./ILayerToolConfig";

/**
 * This interface declares functions for using the state of the layer tool.
 * 
 * @author Jiri Hynek
 */
interface ILayerToolState extends IMapToolState {

    /**
     * The metod takes config and deserializes the values.
     * 
     * @param config 
     */
    deserialize(config: ILayerToolConfig): void;

    /**
     * The method serializes the tool state. Optionally, defaults can be set if property is undefined.
     * 
     * @param filterDefaults
     */
    serialize(filterDefaults: boolean): ILayerToolConfig;

    /**
     * It returns the layer name property of the tool state.
     */
    getLayerName(): string;

    /**
     * It sets the layer name property of the tool state.
     * 
     * @param layerName 
     */
    setLayerName(layerName: string): void;

    /**
     * It returns the data mapping property of the tool state.
     * 
     * TODO: specify the type.
     */
    getDataMapping(): any;

    /**
     * It sets the data mapping property of tool state.
     * 
     * TODO: specify the type.
     * 
     * @param dataMapping 
     */
    setDataMapping(dataMapping: any): void;

    /**
     * It returns the layer items property of the tool state.
     * 
     * TODO: specify the type
     */
    getLayerItems(): any[] | undefined;

    /**
     * It sets the layer items property of tool state.
     * 
     * TODO: specify the type
     * 
     * @param layerItems 
     */
    setLayerItems(layerItems: any[]): void;
}
export default ILayerToolState;