import LayerToolState from "../../../../../../model/internal/layer/LayerToolState";
import IChoroplethLayerTool from "../../types/tool/IChoroplethLayerTool";
import IChoroplethLayerToolState from "../../types/tool/IChoroplethLayerToolState";
import IChoroplethLayerToolDimensions from "../../types/tool/IChoroplethLayerToolDimensions";
import IChoroplethLayerToolProps from "../../types/tool/IChoroplethLayerToolProps";
import IChoroplethLayerToolDefaults from "../../types/tool/IChoroplethLayerToolDefaults";
import IMap from "../../../../../../model/types/map/IMap";
import IChoroplethLayerToolConfig from "../../types/tool/IChoroplethLayerToolConfig";

/**
 * This class provide functions for using the state of the layer tool.
 * 
 * @author Jiri Hynek
 */
class ChoroplethLayerToolState extends LayerToolState implements IChoroplethLayerToolState {

    private dimensions: IChoroplethLayerToolDimensions;
    private geoJSONlayer: L.GeoJSON | undefined;
    private popup: L.Control | undefined;
    private polygons: any; // TODO: specify the type
    private hoveredItem: any; // TODO: specify the type
    private zindex: number;

    /**
     * It creates a tool state.
     */
    public constructor(tool: IChoroplethLayerTool) {
        super(tool);

        const props: IChoroplethLayerToolProps = <IChoroplethLayerToolProps> this.getProps();
        const defaults: IChoroplethLayerToolDefaults = <IChoroplethLayerToolDefaults> this.getDefaults();

        // sets map dimensions
        if(props.dimensions) {
            this.dimensions = {
                geo: props.dimensions.geo == undefined ? defaults.getGeoDimension() : props.dimensions.geo,
                value: props.dimensions.value == undefined ? defaults.getValueDimension() : props.dimensions.value,
                aggregation: props.dimensions.aggregation == undefined ? defaults.getAggregationDimension() : props.dimensions.aggregation
            };
        } else {
            this.dimensions = defaults.getDimensions();
        }

        // set z-index
        this.polygons = props.polygons == undefined ? defaults.getPolygons() : props.polygons;
        this.hoveredItem = undefined;
        this.zindex = defaults.getZIndex();
    }

    /**
     * It resets state with respect to initial props.
     */
    public reset(): void {
        super.reset();

        const props = <IChoroplethLayerToolProps> this.getProps();
        const defaults = <IChoroplethLayerToolDefaults> this.getDefaults();

        // the choropleth layer tool properties
        if(props.dimensions) {
            this.dimensions = {
                geo: props.dimensions.geo == undefined ? defaults.getGeoDimension() : props.dimensions.geo,
                value: props.dimensions.value == undefined ? defaults.getValueDimension() : props.dimensions.value,
                aggregation: props.dimensions.aggregation == undefined ? defaults.getAggregationDimension() : props.dimensions.aggregation
            };
        } else {
            this.dimensions = defaults.getDimensions();
        }
        this.setPolygons(props.polygons == undefined ? defaults.getPolygons() : props.polygons);
        this.setHoveredItem(undefined);
        this.setZIndex(defaults.getZIndex());
    }

    /**
     * The metod takes config and deserializes the values.
     * 
     * @param config 
     */
    public deserialize(config: IChoroplethLayerToolConfig): void {
        super.deserialize(config);
        
        // the layer tool config
        if(config.data != undefined) {
            this.deserializeDimensions(config.data.geo, config.data.value, config.data.aggregation);
        }
    }

    /**
     * It sets the map layer dimensions property of tool state.
     * 
     * @param geo 
     * @param value
     * @param aggregation
     */
    public deserializeDimensions(geo: string | undefined, value: string | undefined, aggregation: string | undefined): void {
        const dimensions = this.getDimensions();
        if(geo) dimensions.geo.setDomain(dimensions.geo.getDomainManager().getDomain(geo));
        if(value) dimensions.value.setDomain(dimensions.value.getDomainManager().getDomain(value));
        if(aggregation) dimensions.aggregation.setDomain(dimensions.aggregation.getDomainManager().getDomain(aggregation));
    }

    /**
     * The method serializes the tool state. Optionally, defaults can be set if property is undefined.
     * 
     * @param filterDefaults
     */
    public serialize(filterDefaults: boolean): IChoroplethLayerToolConfig {
        const config: IChoroplethLayerToolConfig = <IChoroplethLayerToolConfig> super.serialize(filterDefaults);

        // serialize the layer tool properties
        const dimensions = this.getDimensions();
        config.data = {
            geo: dimensions.geo.getDomain()?.getName(),
            value: dimensions.value.getDomain()?.getName(),
            aggregation: dimensions.aggregation.getDomain()?.getName(),
        };

        return config;
    }

    /**
     * It sets the map property of the tool state.
     * 
     * Also, it updates map-related properties.
     * 
     * @param map  
     */
    public setMap(map: IMap): void {
        super.setMap(map);

        // update dimensions' data domain managers
        this.dimensions.geo.setDomainManager(map.getState().getMapData());
        this.dimensions.value.setDomainManager(map.getState().getMapData());
    }

    /**
     * It returns the map layer dimensions property of the tool state.
     */
    public getDimensions(): IChoroplethLayerToolDimensions {
        return this.dimensions;
    }

    /**
     * It sets the map layer dimensions property of tool state.
     * 
     * @param dimensions 
     */
    public setDimension(dimensions: IChoroplethLayerToolDimensions): void {
       this.dimensions = dimensions;
    }

    /**
     * It returns a Leaflet geoJSON layer.
     */
    public getGeoJSONLayer(): L.GeoJSON | undefined {
        return this.geoJSONlayer;
    }

    /**
     * It sets a Leaflet geoJSON layer.
     * 
     * @param layer 
     */
    public setGeoJSONLayer(geoJSONlayer: L.GeoJSON): void {
        this.geoJSONlayer = geoJSONlayer;
    }

    /**
     * It returns a Leaflet popup control.
     */
    public getPopup(): L.Control | undefined {
        return this.popup;
    }

    /**
     * It sets a Leaflet popup control.
     * 
     * @param popup 
     */
    public setPopup(popup: L.Control): void {
        this.popup = popup;
    }

    /**
     * It returns the polygons.
     * 
     * TODO: specify the type
     */
    public getPolygons(): any {
        return this.polygons;
    }

    /**
     * It sets the polygons.
     * 
     * TODO: specify the type
     * 
     * @param polygons 
     */
    public setPolygons(polygons: any): void {
        this.polygons = polygons;
    }

    /**
     * It returns the hovered item.
     * 
     * TODO: specify the type
     */
    public getHoveredItem(): any {
        return this.hoveredItem;
    }

    /**
     * It sets the hovered item.
     * 
     * TODO: specify the type
     * 
     * @param hoveredItem 
     */
    public setHoveredItem(hoveredItem: any): void {
        this.hoveredItem = hoveredItem;
    }

    /**
     * It returns the z index.
     */
    public getZIndex(): number {
        return this.zindex;
    }

    /**
     * It sets the z index.
     * 
     * @param zindex 
     */
    public setZIndex(zindex: number): any {
        this.zindex = zindex;
    }
}
export default ChoroplethLayerToolState;