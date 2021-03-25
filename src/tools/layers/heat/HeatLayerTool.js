import L from 'leaflet';
import LL from 'leaflet.markercluster';
import H from 'leaflet.heat';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import './style/heatLayer.scss';
import * as d3 from "d3";
import HeatLayerToolTabControl from './sidebar/HeatLayerToolTabControl';
import HeatLayerToolDefaults from './HeatLayerToolDefaults';
import HeatLayerToolState from './HeatLayerToolState';
import SelectionTool from '../../selection/SelectionTool';
import AbstractLayerTool from '../abstract/AbstractLayerTool';
import ThemesToolEvent from '../../themes/model/event/ThemesToolEvent';
import SelectionToolEvent from '../../selection/model/event/SelectionToolEvent';
import DataChangeEvent from '../../../model/event/basic/DataChangeEvent';

const GRADIENT_DEFAULT = {0.4:"blue", 0.6:"cyan", 0.7:"lime", 0.8:"yellow", 1:"red"};
//                                "blue",          "sky blue"      "blue green",    "yellow",       "orange",     "vermillion"
const GRADIENT_PROTAN_DEUTRAN = { 0.4: "#00B9F1", 0.6: "#00A875", 0.7: "#ECDE38", 0.8: "#F7931D", 1: "#F15A22"};

const date = "2021-03-02";

/**
 * This class represents Heatmap layer.
 * 
 * @author Petr Kaspar
 */
class HeatLayerTool extends AbstractLayerTool {

    /**
     * It creates a new tool with respect to the props.
     * 
     * @param {*} props 
     */
    constructor(props) {
        super(props);
        this.maxValue = undefined;
        this.radius = undefined;
        this.gradient = GRADIENT_DEFAULT;
    }

    /**
     * A unique string of the tool type.
     */
    static TYPE() {
        return "geovisto-tool-layer-heat";
    }

    /**
     * It creates a copy of the uninitialized tool.
     */
    copy() {
        return new HeatLayerTool(this.getProps());
    }

    /**
     * It creates new defaults of the tool.
     */
    createDefaults() {
        return new HeatLayerToolDefaults();
    }

    /**
     * It returns default tool state.
     */
    createState() {
        return new HeatLayerToolState();
    }

    /**
     * Radius setter
     *
     * @param radius
     */
    setRadius(radius) {
        if (isNaN(radius) || radius === '') {
            this.radius = undefined;

            return;
        }
        this.radius = parseInt(radius);
    }

    /**
     * Help function which acquires and returns the selection tool if available.
     */
    getSelectionTool() {
        if(this.selectionTool == undefined) {
            let tools = this.getMap().getState().getTools().getByType(SelectionTool.TYPE());
            if(tools.length > 0) {
                this.selectionTool = tools[0];
            }
        }
        return this.selectionTool;
    }

    /**
     * It creates new tab control.
     */
    createSidebarTabControl() {
        return new HeatLayerToolTabControl({ tool: this });
    }

    /**
     * It creates layer items.
     */
    createLayerItems() {
        let layer = L.layerGroup([]);

        // update state
        this.getState().setLayer(layer);

        this.redraw();

        return [ layer ];
    }

    /**
     * It deletes layer items.
     */
    deleteLayerItems() {
        //console.log("marker");
        let layers = this.getState().getLayers();

        // delete the 'value' property of every geo feature object if defined
        let layer = this.getState().getLayer();
        for(let i = 0; i < layers.length; i++) {
            layer.removeLayer(layers[i]);
        }
        
        this.getState().setLayers([]);
    }

    /**
     * It prepares data for markers.
     */
    prepareMapData() {
        //console.log("updating map data", this);

        // prepare data
        let workData = [];
        let mapData = this.getMap().getState().getMapData();
        let dataMappingModel = this.getDefaults().getDataMappingModel();
        let dataMapping = this.getState().getDataMapping();
        let latitudeDataDoman = mapData.getDataDomain(dataMapping[dataMappingModel.latitude.name]);
        let longitudeDataDomain = mapData.getDataDomain(dataMapping[dataMappingModel.longitude.name]);
        let intensityDataDomain = mapData.getDataDomain(dataMapping[dataMappingModel.intensity.name]);
        let foundLats, foundLongs, foundRadius, foundIntensity;
        let data = this.getMap().getState().getCurrentData();
        let dataLen = data.length;
        this.maxValue = 0;
        for (let i = 0; i < dataLen; i++) {
            foundLats = mapData.getItemValues(latitudeDataDoman, data[i]);
            foundLongs = mapData.getItemValues(longitudeDataDomain, data[i]);
            foundRadius = this.radius ? [this.radius] : [];
            foundIntensity = mapData.getItemValues(intensityDataDomain, data[i]);

            if (foundLats.length === 1 && foundLongs.length === 1 && foundIntensity.length === 1 && foundRadius.length === 1) {
                workData.push({lat: foundLats[0], long: foundLongs[0], intensity: foundIntensity[0], radius: foundRadius[0]});
            }
            if (foundIntensity.length === 1 && foundIntensity[0] > this.maxValue) {
                this.maxValue = foundIntensity[0];
            }
        }

        return workData;
    }

    /**
     * It reloads data and redraw the layer.
     */
    redraw(onlyStyle) {
        if(this.getState().getLayer()) {
            // delete actual items
            this.deleteLayerItems();

            // prepare data
            let workData = this.prepareMapData();
            const layers = this.createHeatLayers(workData);
            const toolLayer = this.getState().getLayer();

            layers.forEach((layer) => {
                toolLayer.addLayer(layer);
            });

            // update state
            this.getState().setLayers(layers);
        }
    }

    /**
     * Creates heat layers. Should create only one at this time as multiple layers tend to be horribly slow for
     * bigger data sets.
     *
     * @param workData
     * @returns {[]}
     */
    createHeatLayers(workData) {
        let layers = [];

        if ( ! workData.length) {
            return layers;
        }

        // If radius is static there is no point in drawing multiple heat layers for each data set
        if (this.radius) {
            let data = [];

            workData.forEach((item) => {
                data.push([item.lat, item.long, item.intensity])
            });
            layers.push(L.heatLayer(data,
                {
                    radius: this.radius,
                    gradient: this.gradient,
                    max: this.maxValue,
                })
            );

            return layers;
        }

        workData.forEach((item) => {
            layers.push(L.heatLayer([
                [item.lat, item.long, item.intensity]
            ],
                {
                    radius: item.radius,
                    gradient: this.gradient,
                    max: this.maxValue
                }))
        });

        return layers;
    }

    /**
     * This function is called when a custom event is invoked.
     * 
     * @param {AbstractEvent} event 
     */
    handleEvent(event) {
        if(event.getType() == DataChangeEvent.TYPE()) {
            // data change
            this.redraw();
        } else if(event.getType() == SelectionToolEvent.TYPE()) {
            this.redraw();
            // TODO
        } else if(event.getType() == ThemesToolEvent.TYPE()) {
            // theme change
            // TODO
        }
    }
}

export default HeatLayerTool;