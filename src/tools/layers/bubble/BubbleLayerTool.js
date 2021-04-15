import L, {marker} from 'leaflet';
import LL from 'leaflet.markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import './style/bubbleLayer.scss';
import * as d3 from "d3";
import BubbleLayerToolTabControl from './sidebar/BubbleLayerToolTabControl';
import BubbleLayerToolDefaults from './BubbleLayerToolDefaults';
import BubbleLayerToolState from './BubbleLayerToolState';
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
let CountryIcon = L.DivIcon.extend({
    options: {
        className: "div-country-icon",
        isGroup: false,
    },

    createIcon: function (oldIcon) {
        let div = (oldIcon && oldIcon.tagName === 'DIV') ? oldIcon : document.createElement('div'),
            options = this.options;

        // TODO create slider for size
        let scale = d3.scaleSqrt().domain([0, options.max]).range([10, 80]);
        let size = scale(options.values.value);
        let zoom = options.map().map._zoom;
        size = size*zoom/4;

        options.iconSize = [size, size];
        options.iconAnchor = [size / 2, size / 2];
        let divContent = div.appendChild(document.createElement('div'));

        let element = d3.select(divContent);
        let svg = element.append("svg");
        svg.attr("width", size).attr("height", size);

        if (options.values.value != null && options.values.value !== 0) {
            let pie = d3.pie().value(function (d) { return d[1]; });
            let values_ready = pie(Object.entries(options.values.subvalues));
            const colors = options.values.colors;

            // pie chart
            svg.append("g")
                .attr("transform", "translate(" + size / 2 + "," + size / 2 + ")")
                .selectAll("abc")
                .data(values_ready)
                .enter()
                .append("path")
                .attr("d", d3.arc()
                    .innerRadius(0)
                    .outerRadius(size / 2)
                )
                .attr('fill', (d) => {
                    const key = d.data[0];
                    if (colors && colors[key]) {
                        return colors[key];
                    }
                    return 'red';
                })
                 .attr("opacity", 0.5)
                .append('title')
                .text(options.values.value);
        }
        this._setIconStyles(div, 'icon');

        return div;
    },
});

/**
 * This class represents Marker layer. It works with geojson polygons representing countries.
 *
 * @author Jiri Hynek
 */
class BubbleLayerTool extends AbstractLayerTool {

    /**
     * It creates a new tool with respect to the props.
     *
     * @param {*} props
     */
    constructor(props) {
        super(props);
        this.max = 0;
        this.categoryFilters = [];
    }

    /**
     * A unique string of the tool type.
     */
    static TYPE() {
        return "geovisto-tool-layer-bubble";
    }



    /**
     * It creates a copy of the uninitialized tool.
     */
    copy() {
        return new BubbleLayerTool(this.getProps());
    }

    /**
     * It creates new defaults of the tool.
     */
    createDefaults() {
        return new BubbleLayerToolDefaults();
    }

    /**
     * It returns default tool state.
     */
    createState() {
        return new BubbleLayerToolState();
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
        return new BubbleLayerToolTabControl({ tool: this });
    }

    /**
     * It creates layer items.
     */
    createLayerItems() {
        let layer = L.markerClusterGroup({
            spiderfyOnMaxZoom: false,
            maxClusterRadius: 65,       // TODO create slider for parametric clustering radius
            // create cluster icon
            iconCreateFunction: (cluster) => {
                let markers = cluster.getAllChildMarkers();
                let data = { id: "<Group>", value: 0, subvalues: {} , colors: {}};
                let max = 0;
                let map = markers[0].options.icon.options.map;
                for (let i = 0; i < markers.length; i++) {
                    data.value += markers[i].options.icon.options.values.value;
                    max = max === 0 ? markers[i].options.icon.options.max : max;
                    for (let [key, value] of Object.entries(markers[i].options.icon.options.values.subvalues)) {
                        if (data.subvalues[key] === undefined) {
                            data.subvalues[key] = value;
                        } else {
                            data.subvalues[key] += value;
                        }
                        if (markers[i].options.icon.options.values.colors) {
                            data.colors[key] = markers[i].options.icon.options.values.colors[key];
                        }
                    }
                }
                // create custom icon
                return new CountryIcon({
                    countryName: "<Group>",
                    values: data,
                    map: map,   //Geovisto map object
                    max: max,
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
        let actResultItem;
        let foundLats, foundLongs, foundValues, foundCategories;
        let data = this.getMap().getState().getCurrentData();
        let dataLen = data.length;
        this.max = 0;

        for (let i = 0; i < dataLen; i++) {
            let found = false;
            actResultItem = {};
            foundLats = mapData.getItemValues(latitudeDataDomain, data[i]);
            foundLongs = mapData.getItemValues(longitudeDataDomain, data[i]);
            foundValues = mapData.getItemValues(valueDataDomain, data[i]);
            foundCategories = mapData.getItemValues(categoryDataDomain, data[i]);

            if (foundLats.length !== 1 || foundLongs.length !== 1 || foundValues.length !== 1) {
                return [];
            }

            if (isNaN(foundLats[0]) || isNaN(foundLongs[0]) || isNaN(foundValues[0])) {
                return [];
            }

            actResultItem = workData.find((x) => x.lat === foundLats[0] && x.long === foundLongs[0]);
            if ( ! actResultItem) {
                actResultItem = {lat: foundLats[0], long: foundLongs[0], value: 0, subvalues: {}, colors: {}};
                workData.push(actResultItem);
            }

            if (dataMapping[dataMappingModel.aggregation.name] !== "count") {
                actResultItem.value += foundValues[0];
                this.max += foundValues[0];
            } else {
                actResultItem.value++;
                this.max++;
            }


            if (foundCategories.length === 1) {
                actResultItem.subvalues[foundCategories[0]] = foundValues[0];
                actResultItem.category = foundCategories[0];

                for (let j = 0; j < this.categoryFilters.length; j++) {
                    const filter = this.categoryFilters[j];
                    if (filter.operation(actResultItem.category, filter.value)) {
                        actResultItem.colors = actResultItem.colors ?? {};
                        actResultItem.colors[foundCategories[0]] = filter.color;
                        break;
                    }
                }
            } else {
                actResultItem.subvalues[undefined] = foundValues[0];
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

        let layer = this.getState().getLayer();;
        for (let i = 0; i < workData.length; i++) {

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
            let num_parts = num.toString().split(".");
            num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            return num_parts.join(".");
        }
        // build popup message
         let popupMsg = "<b>" + "Detail:" + "</b><br>";
         popupMsg += (data.value != null ? "Aggregated: " + thousands_separator(data.value) : "N/A") + "<br>";
         for (let [key, value] of Object.entries(data.subvalues)) {
             popupMsg += key + ": " + thousands_separator(value) + "<br>";
         }
        // create marker
        let point = L.marker([data.lat, data.long], {
            // create basic icon 
            id: 'id',
            icon: new CountryIcon({
                values: data,
                max: this.max,
                map: () => this.getMap()
            })
        }).bindPopup(popupMsg);
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
        if (event.getType() === DataChangeEvent.TYPE()) {
            // data change
            this.redraw();
        } else if (event.getType() === SelectionToolEvent.TYPE()) {
            this.redraw();
            // TODO
        } else if(event.getType() === ThemesToolEvent.TYPE()) {
            let map = event.getObject();
            document.documentElement.style.setProperty('--leaflet-marker-donut1', map.getDataColors().triadic1);
            document.documentElement.style.setProperty('--leaflet-marker-donut2', map.getDataColors().triadic2);
            document.documentElement.style.setProperty('--leaflet-marker-donut3', map.getDataColors().triadic3);
        }
    }
}

export default BubbleLayerTool;