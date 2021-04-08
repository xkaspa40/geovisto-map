import L from "leaflet";
import "leaflet.markercluster";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "./style/markerLayer.scss";
import * as d3 from "d3";
import MarkerLayerToolTabControl from "./sidebar/MarkerLayerToolTabControl";
import MarkerLayerToolDefaults from "./MarkerLayerToolDefaults";
import MarkerLayerToolState from "./MarkerLayerToolState";
import SelectionTool from "../../selection/SelectionTool";
import AbstractLayerTool from "../abstract/AbstractLayerTool";
import ThemesToolEvent from "../../themes/model/event/ThemesToolEvent";
import SelectionToolEvent from "../../selection/model/event/SelectionToolEvent";
import DataChangeEvent from "../../../model/event/basic/DataChangeEvent";
import TimeChangeEvent from "../../timeline/model/TimeChangeEvent";
import { createClusterMarkersData, createMarkerPopupContent } from "./utils";
import { TimeDestroyedEvent } from "../../timeline/model/TimeDestroyedEvent";
import { ToolInitializedEvent } from "../../../model/event/basic/ToolInitializedEvent";
import { TimelineTool } from "../../timeline";

/**
 * This class represents custom div icon which is used to mark center of countries.
 * It overrides L.DivIcon.
 *
 * @author Jiri Hynek
 * @override {L.DivIcon}
 */
const CountryIcon = L.DivIcon.extend({
    _svgGroup: null,
    levels: [
        { level: -Infinity, suffix: "N/A", color: "#CCCCCC" },
        { level: 1, suffix: "", color: "#CCCCCC" },
        { level: 1e2, suffix: "K", color:  "#AAAAAA" },
        { level: 1e5, suffix: "M", color:  "#555555" },
        { level: 1e8, suffix: "B", color:  "#222222" },
        { level: 1e11, suffix: "t", color:  "#111111" },
    ],

    // moved to css
    //donutColors: ["darkred", "goldenrod", "gray"],

    options: {
        sizeBasic: 32,
        sizeGroup: 36,
        sizeDonut: 48,

        // It is derived
        //iconSize: [32,32],
        //iconAnchor: [32/2,32/2],

        className: "div-country-icon",
        values: {
            id: "",
            value: 0,
            subvalues: {
                active: 0,
                mitigated: 0,
                finished: 0,
            }
        },
        isGroup: false,
        useDonut: true,
    },

    round: function (value, align) {
        return Math.round(value * align) / align;
    },

    formatValue: function (value, level) {
        if (level == null || level < 0) {
            return this.levels[0].suffix;
        }
        if (this.levels[level].level === -Infinity) {
            return this.levels[level].suffix;
        }
        if (this.levels[level].level === 1) {
            return this.round(value, this.levels[level].level);
        }
        value = value / (this.levels[level].level * 10);
        const align = (value >= 10) ? 1 : 10;
        return `${this.round(value, align)}${this.levels[level].suffix}`;
    },

    getColor: function (level) {
        return level == null || level < 0 ?
            this.levels[0].color:
            this.levels[level].color;
    },

    getLevel: function(value) {
        for (let i = this.levels.length - 1; i >= 0; i--) {
            if (value >= this.levels[i].level) return i;
        }
        return -1;
    },

    getSize: function() {
        const { useDonut, sizeDonut, isGroup, sizeGroup, sizeBasic } = this.options;
        return useDonut ? sizeDonut : (isGroup ? sizeGroup : sizeBasic);
    },

    arc: (size) => {
        return d3.arc()
            .innerRadius(size / 4 + 6)
            .outerRadius(size / 2)
    },

    createIcon: function (oldIcon) {
        const div = (oldIcon && oldIcon.tagName === 'DIV') ? oldIcon : document.createElement('div'),
            options = this.options;

        const size = this.getSize(this);
        const center = size / 2;
        options.iconSize = [size, size];
        options.iconAnchor = [center, center];
        const rCircle = options.sizeBasic / 2;
        // moved to css
        const level = this.getLevel(options.values.value);

        const divContent = div.appendChild(document.createElement('div'));
        divContent.classList.value =
            "leaflet-marker-level" + level // level
            + (options.isGroup ? " leaflet-marker-group" : ""); // group of several markers

        const svg = d3.select(divContent)
            .append("svg")
            .attr("width", size)
            .attr("height", size);

        // circle
        svg.append("circle")
            .attr("cx", center)
            .attr("cy", center)
            .attr("r", rCircle)

        // value label
        this._label = svg.append("text")
            .html(this.formatValue(options.values.value, level))
            .attr("x", "50%")
            .attr("y", "50%")
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("dy", "0.3em")
            .attr("font-family", "Arial");

        // donut chart if value is null, the donut chart is created but is empty (i.e. not visible),
        // this is needed behaviour since when using timeline the next time step updates existing donut chart
        this._svgGroup = svg
            .append("g")
            .attr("transform", `translate(${center}, ${center})`);

        const pie = d3.pie().value((d) => d[1]).sort(null);
        this._svgGroup
            .datum(Object.entries(options.values.subvalues))
            .selectAll("path")
            .data(pie)
            .enter()
            .append("path")
            .attr("class", function (d, i) { return "leaflet-marker-donut" + (i % 3 + 1); })
            .attr("d", this.arc(size))
            .each(function (d) { this._current = d });

        if (options.bgPos) {
            const bgPos = point(options.bgPos);
            div.style.backgroundPosition = (-bgPos.x) + 'px ' + (-bgPos.y) + 'px';
        }
        this._setIconStyles(div, 'icon');
        return div;
    },

    updateData: function(values, transitionDuration, transitionDelay) {
        this.options.values = values;
        if (this._label) {
            const level = this.getLevel(this.options.values.value);
            this._label.text(this.formatValue(this.options.values.value, level))
        }

        if (this._svgGroup) {
            const pie = d3.pie().value((d) => d[1]).sort(null);
            const size = this.getSize(this);
            const arc = this.arc(size);
            this._svgGroup
                .datum(Object.entries(this.options.values.subvalues))
                .selectAll("path")
                .data(pie)
                .transition()
                .delay(transitionDelay)
                .duration(transitionDuration)
                .attrTween("d", function(a) {
                    const i = d3.interpolate(this._current, a);
                    this._current = i(0);
                    return (t) => arc(i(t));
                });
        }
    }
});

/**
 * This class represents Marker layer. It works with geojson polygons representing countries.
 *
 * @author Jiri Hynek
 */
class MarkerLayerTool extends AbstractLayerTool {

    /**
     * It creates a new tool with respect to the props.
     *
     * @param {*} props
     */
    constructor(props) {
        super(props);
        this._transitionDuration = 500;
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
        return new MarkerLayerTool(this.getProps());
    }

    /**
     * It creates new defaults of the tool.
     */
    createDefaults() {
        return new MarkerLayerToolDefaults();
    }

    /**
     * It returns default tool state.
     */
    createState() {
        return new MarkerLayerToolState();
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

    updateDataMapping(dataMapping, onlyStyle) {
        // update state
        this.getState().setDataMapping(dataMapping);

        // redraw the layer items
        const data = this.getMap().getState().getCurrentData();
        this.redraw(data);
        this.getMap().dispatchEvent(new ToolInitializedEvent(MarkerLayerTool.TYPE()))
    }

    /**
     * It creates new tab control.
     */
    createSidebarTabControl() {
        return new MarkerLayerToolTabControl({ tool: this });
    }

    /**
     * It creates layer items.
     */
    createLayerItems() {
        // create layer which clusters points
        let layer = L.markerClusterGroup({
            // create cluster icon
            iconCreateFunction: function (cluster) {
                const markers = cluster.getAllChildMarkers();
                const markerData = createClusterMarkersData(markers);
                // create custom icon
                return new CountryIcon({
                    countryName: "<Group>",
                    values: markerData,
                    isGroup: true,
                });
            }
        });

        // update state
        this.getState().setLayer(layer);

        const data = this.getMap().getState().getCurrentData();
        this.redraw(data);

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
    prepareMapData(data) {
        //console.log("updating map data", this);

        // prepare data
        let workData = {};
        let mapData = this.getMap().getState().getMapData();
        let dataMappingModel = this.getDefaults().getDataMappingModel();
        let dataMapping = this.getState().getDataMapping();
        let countryDataDomain = mapData.getDataDomain(dataMapping[dataMappingModel.country.name]);
        let valueDataDomain = mapData.getDataDomain(dataMapping[dataMappingModel.value.name]);
        let categoryDataDomain = mapData.getDataDomain(dataMapping[dataMappingModel.category.name]);
        let geoCountry, actResultItem;
        let foundCountries, foundValues, foundCategories;
        let highlightedIds = this.getSelectionTool() && this.getSelectionTool().getState().getSelection() ?
            this.getSelectionTool().getState().getSelection().getIds() : [];
        let dataLen = data.length;
        let centroids = this.getState().getCentroids();
        for (let i = 0; i < dataLen; i++) {
            foundCountries = mapData.getItemValues(countryDataDomain, data[i]);
            foundValues = mapData.getItemValues(valueDataDomain, data[i]);
            foundCategories = mapData.getItemValues(categoryDataDomain, data[i]);

            // since the data are flattened we can expect max one found item
            if (foundCountries.length == 1 && (highlightedIds.length == 0 || highlightedIds.indexOf(foundCountries[0]) >= 0)) {
                // test if country respects highlighting selection
                /*if(highlightedIds != undefined) {
                    console.log(highlightedIds.indexOf(foundCountries[0]) >= 0);
                }*/

                // test if country exists in the map
                geoCountry = centroids.find(x => x.id == foundCountries[0]);
                if (geoCountry != undefined) {
                    // test if country exists in the results array
                    actResultItem = workData[foundCountries[0]];
                    if (actResultItem == undefined) {
                        actResultItem = { id: foundCountries[0], value: 0, subvalues: {} };
                        workData[foundCountries[0]] = actResultItem;
                    }
                    // initialize category if does not exists yet
                    if (foundCategories.length == 1) {
                        if (actResultItem.subvalues[foundCategories[0]] == undefined) {
                            actResultItem.subvalues[foundCategories[0]] = 0;
                        }
                    }
                    // set value with respect to the aggregation function
                    if (dataMapping[dataMappingModel.aggregation.name] == "sum") {
                        // test if value is valid
                        if (foundValues.length == 1 && foundValues[0] != null && typeof foundValues[0] === 'number') {
                            actResultItem.value += foundValues[0];
                            // set category
                            if (foundCategories.length == 1) {
                                actResultItem.subvalues[foundCategories[0]] += foundValues[0];
                            }
                        }
                    } else {
                        // count
                        actResultItem.value++;
                        // incerement category value
                        actResultItem.subvalues[foundCategories[0]]++;
                    }
                }
            }
        }
        //console.log("result: ", preparedData);
        return workData;
    }

    /**
     * It creates markers using workData
     */
    createMarkers(workData) {
        const layer = this.getState().getLayer();
        const centroids = this.getState().getCentroids();

        const markers = Object.values(workData).reduce((acc, workDatum)  => {
            const geoCountry = centroids.find(centroid => centroid.id === workDatum.id);
            const point = this.createMarker(geoCountry, workDatum);
            layer.addLayer(point)
            return [...acc, point]
        }, [])

        return markers;
    }

    /**
     * It creates one marker with respect to the given centroid and data.
     *
     * @param {*} centroid
     * @param {*} data
     */
    createMarker(centroid, data) {
        // create marker
        let point = L.marker([centroid.lat, centroid.long], {
            // create basic icon
            id: centroid.id,
            name: centroid.name,
            icon: new CountryIcon({ values: data }),
            updateData: function (values, transitionDuration, transitionDelay) {
                this.icon.updateData.call(this.icon, values, transitionDuration, transitionDelay);
            },
        }).bindPopup(createMarkerPopupContent(centroid.name, data.value, data.subvalues));
        return point;
    }

    /**
     * It reloads data and redraw the layer.
     */
    redraw(data) {
        if (this.getState().getLayer()) {
            // delete actual items
            this.deleteLayerItems();
            // prepare data
            let workData = this.prepareMapData(data);
            // update map
            let markers = this.createMarkers(workData);
            // update state
            this.getState().setMarkers(markers);
        }
    }

    updateMarkers({ data, transitionDuration, transitionDelay }) {
        const markersData = this.prepareMapData(data);

        this.getState().getMarkers().forEach((marker) => {
            const markerData = markersData[marker.options.id] || {
                id: marker.options.id,
                value: null,
                subvalues: Object.keys(marker.options.icon.options.values.subvalues)
                    .reduce((subValues, key) => ({ ...subValues, [key]: null }), {}),
            };

            marker.options.updateData(markerData, transitionDuration, transitionDelay)
            marker._popup.setContent(createMarkerPopupContent(
                marker.options.name,
                markerData.value,
                markerData.subvalues
            ))
        })

        this.getState().getLayer()._featureGroup.eachLayer(function (marker) {
            if (marker instanceof L.MarkerCluster) {
                const markers = marker.getAllChildMarkers();
                const markerData = createClusterMarkersData(markers);
                marker._iconObj.updateData.call(marker._iconObj, markerData, transitionDuration, transitionDelay)
            }
        });
    }

    /**
     * This function is called when a custom event is invoked.
     *
     * @param {AbstractEvent} event
     */
    handleEvent(event) {
        if (event.getType() === DataChangeEvent.TYPE()) {
            // data change
            if (event.getSource() !== "timeline") {
                let data = this.getMap().getState().getCurrentData();
                this.redraw(data);
            }
        } else if (event.getType() === SelectionToolEvent.TYPE()) {
            let data = this.getMap().getState().getCurrentData();
            this.redraw(data);
            // TODO
        } else if(event.getType() === ThemesToolEvent.TYPE()) {
            var map = event.getObject();
            document.documentElement.style.setProperty('--leaflet-marker-donut1', map.getDataColors().triadic1);
            document.documentElement.style.setProperty('--leaflet-marker-donut2', map.getDataColors().triadic2);
            document.documentElement.style.setProperty('--leaflet-marker-donut3', map.getDataColors().triadic3);
        } else if (event.getType() === TimeChangeEvent.TYPE()) {
            this.updateMarkers(event.getObject());
        }
    }
}

export default MarkerLayerTool;
