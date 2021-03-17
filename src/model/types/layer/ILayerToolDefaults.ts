import IMapToolDefaults from "../tool/IMapToolDefaults";

/**
 * This interface declares functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
interface ILayerToolDefaults extends IMapToolDefaults {

    /**
     * It returns the layer name.
     */
    getLayerName(): string;

    /**
     * It returns the default mapping of data domains to chart dimensions.
     * 
     * TODO: specify the type
     */
    getDataMapping(): any;

    /**
     * It returns the data mapping model.
     * 
     * TODO: define type.
     */
    getDataMappingModel(): any;
}
export default ILayerToolDefaults;