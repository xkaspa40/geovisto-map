import L from 'leaflet';
import LL from 'leaflet.markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import './style/spikeLayer.scss';
import * as d3 from "d3";
import SpikeLayerToolTabControl from './sidebar/SpikeLayerToolTabControl';
import SpikeLayerToolDefaults from './SpikeLayerToolDefaults';
import SpikeLayerToolState from './SpikeLayerToolState';
import SelectionTool from '../../selection/SelectionTool';
import AbstractLayerTool from '../abstract/AbstractLayerTool';
import ThemesToolEvent from '../../themes/model/event/ThemesToolEvent';
import SelectionToolEvent from '../../selection/model/event/SelectionToolEvent';
import DataChangeEvent from '../../../model/event/basic/DataChangeEvent';

/**
 * This class represents custom div icon which is used to mark center of countries.
 * It overrides L.DivIcon.
 *
 * @author Jiri Hynek
 * @override {L.DivIcon}
 */
var CountryIcon = L.DivIcon.extend({
    options: {
        sizeBasic: 32,
        sizeGroup: 36,
        sizeDonut: 48,

        // It is derived
        //iconSize: [32,32],
        //iconAnchor: [32/2,32/2],

        className: "div-country-icon",
    },


    createIcon: function (oldIcon) {
        var div = (oldIcon && oldIcon.tagName === 'DIV') ? oldIcon : document.createElement('div'),
            options = this.options;

        var divContent = div.appendChild(document.createElement('div'));
        let size = 30;
        //console.log(size);
        let svg = d3.select(divContent).append('svg');
        svg.attr('width', size);
        svg.attr('height', size);
        svg.append('circle')
            .attr('cx', size/2)
            .attr('cy', size/2)
            .attr('r', size/4)
            .attr('style', 'fill: red');
        //console.log(element)

        this._setIconStyles(div, 'icon');
        console.log('here');
        return div;
    },
});

/**
 * This class represents Marker layer. It works with geojson polygons representing countries.
 *
 * @author Jiri Hynek
 */
class SpikeLayerTool extends AbstractLayerTool {

    /**
     * It creates a new tool with respect to the props.
     *
     * @param {*} props
     */
    constructor(props) {
        super(props);
    }

    /**
     * A unique string of the tool type.
     */
    static TYPE() {
        return "geovisto-tool-layer-marker";
    }

    /**
     * It creates a copy of the uninitialized tool.
     */
    copy() {
        return new SpikeLayerTool(this.getProps());
    }

    /**
     * It creates new defaults of the tool.
     */
    createDefaults() {
        return new SpikeLayerToolDefaults();
    }

    /**
     * It returns default tool state.
     */
    createState() {
        return new SpikeLayerToolState();
    }

    /**
     * Help function which acquires and returns the selection tool if available.
     */
    getSelectionTool() {
        if (this.selectionTool == undefined) {
            let tools = this.getMap().getState().getTools().getByType(SelectionTool.TYPE());
            if (tools.length > 0) {
                this.selectionTool = tools[0];
            }
        }
        return this.selectionTool;
    }

    /**
     * It creates new tab control.
     */
    createSidebarTabControl() {
        return new SpikeLayerToolTabControl({ tool: this });
    }

    /**
     * It creates layer items.
     */
    createLayerItems() {
        // create layer which clusters points
        //let layer = L.layerGroup([]);
        let layer = L.markerClusterGroup({

            // create cluster icon
            iconCreateFunction: function (cluster) {
                var markers = cluster.getAllChildMarkers();
                let data = { id: "<Group>", value: 0, subvalues: {} };
                for (var i = 0; i < markers.length; i++) {
                    data.value += markers[i].options.icon.options.values.value;
                    for (let [key, value] of Object.entries(markers[i].options.icon.options.values.subvalues)) {
                        if (data.subvalues[key] == undefined) {
                            data.subvalues[key] = value;
                        } else {
                            data.subvalues[key] += value;
                        }
                    }
                }
                // create custom icon
                return new CountryIcon({
                    countryName: "<Group>",
                    values: data,
                    isGroup: true,
                });
            }
        });

        // update state
        this.getState().setLayer(layer);

        this.redraw();

        return [layer];
    }

    /**
     * It deletes layer items.
     */
    deleteLayerItems() {
        //console.log("marker");
        let markers = this.getState().getMarkers();

        // delete the 'value' property of every geo feature object if defined
        let layer = this.getState().getLayer();
        for (let i = 0; i < markers.length; i++) {
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
        let latitudeDataDomain = mapData.getDataDomain(dataMapping[dataMappingModel.latitude.name]);
        let longitudeDataDomain = mapData.getDataDomain(dataMapping[dataMappingModel.longitude.name]);
        let valueDataDomain = mapData.getDataDomain(dataMapping[dataMappingModel.value.name]);
        let categoryDataDomain = mapData.getDataDomain(dataMapping[dataMappingModel.category.name]);
        let geoCountry, actResultItem;
        let foundCountries, foundValues, foundCategories;
        let data = this.getMap().getState().getCurrentData();
        let dataLen = data.length;
        for (let i = 0; i < dataLen; i++) {
            // find the 'country' properties

        }
        //console.log("result: ", preparedData);
        return [{lat:"50.0874654", long:"14.4212535", value: 100}];
    }

    /**
     * It creates markers using workData
     */
    createMarkers(workData) {
        // create markers
        let markers = [];

        let geoCountry;
        let layer = this.getState().getLayer();
        for (let i = 0; i < workData.length; i++) {
            // build message
            let point = this.createMarker(workData[i]);
            layer.addLayer(point);
            markers.push(point);
        }

        return markers;
    }

    /**
     * It creates one marker with respect to the given centroid and data.
     *
     * @param {*} centroid
     * @param {*} data
     */
    createMarker(data) {
        function thousands_separator(num) {
            var num_parts = num.toString().split(".");
            num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            return num_parts.join(".");
        }

        // build popup message


        // create marker

        let point = L.marker([data.lat, data.long], {
            // create basic icon
            icon: new CountryIcon({
                values: data
            })
        });
        console.log(data);
        //let spike =
        return point;
    }

    /**
     * It reloads data and redraw the layer.
     */
    redraw(onlyStyle) {
        if (this.getState().getLayer()) {
            // delete actual items
            this.deleteLayerItems();

            // prepare data
            let workData = this.prepareMapData();

            // update map
            let markers = this.createMarkers(workData);

            // update state
            this.getState().setMarkers(markers);
        }
    }

    /**
     * This function is called when a custom event is invoked.
     *
     * @param {AbstractEvent} event
     */
    handleEvent(event) {
        if (event.getType() == DataChangeEvent.TYPE()) {
            // data change
            this.redraw();
        } else if (event.getType() == SelectionToolEvent.TYPE()) {
            this.redraw();
            // TODO
        } else if(event.getType() == ThemesToolEvent.TYPE()) {
            var map = event.getObject();
            document.documentElement.style.setProperty('--leaflet-marker-donut1', map.getDataColors().triadic1);
            document.documentElement.style.setProperty('--leaflet-marker-donut2', map.getDataColors().triadic2);
            document.documentElement.style.setProperty('--leaflet-marker-donut3', map.getDataColors().triadic3);
        }
    }
}

export default SpikeLayerTool;