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

const SPIKE_WIDTH = 7;

/**
 * This class represents custom div icon which is used to mark center of countries.
 * It overrides L.DivIcon.
 *
 * @author Jiri Hynek
 * @override {L.DivIcon}
 */
var SpikeIcon = L.DivIcon.extend({
    options: {
        className: "div-spike-icon",
    },

    createIcon: function () {
        const div = document.createElement('div');

        const divContent = div.appendChild(document.createElement('div'));
        let svg = d3.select(divContent).append('svg');

        const height = this.options.height;
        const width = this.options.width;
        svg.attr('width', width);
        svg.attr('height', height);
        svg.append('g')
            .attr("fill", this.options.color ?? 'red')
            .attr("stroke", this.options.color ?? 'red')
            .attr('transform', `translate(0,${height})`)
            .append('path')
            .attr('d', `M 0 0 L${width/2} -${height} L ${width} 0`)
            .append('title')
            .text(this.options.value);

        this._setIconStyles(div, 'icon');
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
        this.workData = [];
        this.categoryFilters = [];
        this.max = 0;
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
     * Sets rules for category colors
     *
     * @param rules
     */
    setCategoryFilters(rules) {
        this.categoryFilters = rules;
        this.redraw();
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
        let layer = L.layerGroup([]);

        // update state
        this.getState().setLayer(layer);

        this.redraw();

        this.getMap().addEventListener('zoomend', () => this.redraw(true));

        return [layer];
    }

    /**
     * It deletes layer items.
     */
    deleteLayerItems() {
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
        // prepare data
        let workData = [];
        let mapData = this.getMap().getState().getMapData();
        let dataMappingModel = this.getDefaults().getDataMappingModel();
        let dataMapping = this.getState().getDataMapping();
        let latitudeDataDomain = mapData.getDataDomain(dataMapping[dataMappingModel.latitude.name]);
        let longitudeDataDomain = mapData.getDataDomain(dataMapping[dataMappingModel.longitude.name]);
        let valueDataDomain = mapData.getDataDomain(dataMapping[dataMappingModel.value.name]);
        let categoryDataDomain = mapData.getDataDomain(dataMapping[dataMappingModel.category.name]);
        let actResultItem;
        let foundLats, foundLongs, foundValues, foundCategories;
        let data = this.getMap().getState().getCurrentData();
        let dataLen = data.length;
        this.max = 0;
        for (let i = 0; i < dataLen; i++) {
            foundLats = mapData.getItemValues(latitudeDataDomain, data[i]);
            foundLongs = mapData.getItemValues(longitudeDataDomain, data[i]);
            foundValues = mapData.getItemValues(valueDataDomain, data[i]);
            foundCategories = mapData.getItemValues(categoryDataDomain, data[i]);

            if (foundLats.length !== 1 || foundLongs.length !== 1 || foundValues.length !== 1) {
                return [];
            }

            if (isNaN(foundLats) || isNaN(foundLongs) || isNaN(foundValues)) {
                return [];
            }

            actResultItem = workData.find((record) => record.lat === foundLats[0] && record.long === foundLongs[0] && record.category === foundCategories[0]);
            if ( ! actResultItem) {
                actResultItem = {lat: foundLats[0], long: foundLongs[0], value: 0, category: foundCategories[0]};
                workData.push(actResultItem);
            }

            if (dataMapping[dataMappingModel.aggregation.name] !== "count") {
                actResultItem.value += foundValues[0];
                this.max = this.max > foundValues[0] ? this.max : foundValues[0];
            } else {
                actResultItem.value++;
                this.max++;
            }

            if (foundCategories.length === 1) {
                for (let j = 0; j < this.categoryFilters.length; j++) {
                    const filter = this.categoryFilters[j];
                    if (filter.operation(actResultItem.category, filter.value)) {
                        actResultItem.color = filter.color;

                        break;
                    }
                }
            }

        }

        return workData;
    }

    /**
     * It creates markers using workData
     */
    createMarkers(workData) {
        // create markers
        let markers = [];

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
     * It creates one marker with respect to given data.
     *
     * @param {*} data
     */
    createMarker(data) {
        //create linear scale accepting values from 0 to 100 which maps them to values from 4 to 48
        const scale = d3.scaleLinear().domain([0, this.max]).range([4, 48]);
        const height = this.calculateHeight(scale(data.value));
        const popup = `<b>${data.value}</b>`
        return L.marker([data.lat, data.long], {
            // create spike icon
            icon: new SpikeIcon({
                iconAnchor: [SPIKE_WIDTH/2,height],
                iconSize: [SPIKE_WIDTH, height],
                height: height,
                value: data.value,
                color: data.color,
                width: SPIKE_WIDTH
            })
        }).bindPopup(popup);
    }

    calculateHeight(height) {
        const currentZoom = this.getMap().map._zoom;
        return height*currentZoom/2;
    }

    /**
     * It reloads data and redraw the layer.
     */
    redraw(onlyStyle) {
        if ( ! this.getState().isEnabled() || ! this.getState().getLayer()) {
            return;
        }

        // delete actual items
        this.deleteLayerItems();

        if ( ! onlyStyle) {
            // prepare data
            this.workData = this.prepareMapData();
        }

        // update map
        let markers = this.createMarkers(this.workData);

        // update state
        this.getState().setMarkers(markers);
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