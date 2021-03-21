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

/**
 * This class represents Marker layer. It works with geojson polygons representing countries.
 * 
 * @author Jiri Hynek
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
        // create layer which clusters points
        let layer = L.layerGroup([]);
        // let layer = L.markerClusterGroup({
        //
        //     // create cluster icon
        //     iconCreateFunction: function (cluster) {
        //         var markers = cluster.getAllChildMarkers();
        //         let data = { id: "<Group>", value: 0, subvalues: {} };
        //         for (var i = 0; i < markers.length; i++) {
        //             data.value += markers[i].options.icon.options.values.value;
        //             for(let [key, value] of Object.entries(markers[i].options.icon.options.values.subvalues)) {
        //                 if(data.subvalues[key] == undefined) {
        //                     data.subvalues[key] = value;
        //                 } else {
        //                     data.subvalues[key] += value;
        //                 }
        //             }
        //         }
        //         // create custom icon
        //         return new CountryIcon( {
        //             countryName: "<Group>",
        //             values: data,
        //             isGroup: true,
        //         } );
        //     }
        // });

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
        let markers = this.getState().getMarkers();

        // delete the 'value' property of every geo feature object if defined
        let layer = this.getState().getLayer();
        for(let i = 0; i < markers.length; i++) {
            layer.removeLayer(markers[i]);
        }
        
        this.getState().setMarkers([]);
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
        let actResultItem;
        let foundLats, foundLongs;
        let data = this.getMap().getState().getCurrentData();
        let dataLen = data.length;
        let centroids = this.getState().getCentroids();
        for (let i = 0; i < dataLen; i++) {
            // find the 'country' properties
            foundLats = mapData.getItemValues(latitudeDataDoman, data[i]);
            //console.log("search country: ", foundCountries);

            // find the 'value' properties
            foundLongs = mapData.getItemValues(longitudeDataDomain, data[i]);

        }
        //console.log("result: ", preparedData);
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

            // update map
            //let markers = this.createMarkers(workData);

            const heat = L.heatLayer([
                [50.07203, 15.19287, 0.9] // lat, lng, intensity
            ], {radius: 35}).addTo(this.getMap().getState().getLeafletMap());

            const heat2 = L.heatLayer([
                [50.07256, 15.19267, 0.9]
            ], {radius: 45}).addTo(this.getMap().getState().getLeafletMap());
            // update state
            //this.getState().setMarkers(markers);
        }
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