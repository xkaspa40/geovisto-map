import L from 'leaflet';
import LL from 'leaflet.markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import './style/dotLayer.scss';
import * as d3 from "d3";
import DotLayerToolTabControl from './sidebar/DotLayerToolTabControl';
import DotLayerToolDefaults from './DotLayerToolDefaults';
import DotLayerToolState from './DotLayerToolState';
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

    _LEVEL: 0,
    _SUFFIX: 1,
    _COLOR: 2,
    levels: [
        [-Infinity, "N/A", "#CCCCCC"],
        [1, "", "#CCCCCC"],
        [1e2, "K", "#AAAAAA"],
        [1e5, "M", "#555555"],
        [1e8, "B", "#222222"],
        [1e11, "t", "#111111"],
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
        useDonut: true
    },

    round: function(value, align) {
        return Math.round(value*align)/align;
    },

    formatValue: function(value, level) {
        if(level == undefined || level < 0) {
            return this.levels[0][this._SUFFIX];
        } else {
            if(this.levels[level][this._LEVEL] == -Infinity) {
                return this.levels[level][this._SUFFIX];
            } else if(this.levels[level][this._LEVEL] == 1) {
                return this.round(value, this.levels[level][this._LEVEL]);
            } else {
                value = value/(this.levels[level][this._LEVEL]*10);
                var align = (value >= 10) ? 1 : 10;
                return this.round(value, align) + this.levels[level][this._SUFFIX];
            }
        }
    },

    getColor: function(level) {
        if(level == null || level < 0) {
            return this.levels[0][this._COLOR];
        } else {
            return this.levels[level][this._COLOR];
        }
    },

    getLevel: function(value) {
        for(var i = this.levels.length-1; i >= 0; i--) {
            if(value > this.levels[i][this._LEVEL]) {
            return i;
            }
        }
        return -1;
    },

    createIcon: function (oldIcon) {
        var div = (oldIcon && oldIcon.tagName === 'DIV') ? oldIcon : document.createElement('div'),
            options = this.options;

        var size = options.useDonut ? options.sizeDonut : (options.isGroup ? options.sizeGroup : options.sizeBasic);
        options.iconSize = [size,size];
        options.iconAnchor = [size/2,size/2];
        var rCircle = options.sizeBasic/2;
        var center = size/2;
        // moved to css
        //var strokeWidth = options.isGroup ? ((options.sizeGroup-options.sizeBasic)/2) : 0;
        var level = this.getLevel(options.values.value);

        var divContent = div.appendChild(document.createElement('div'));
        divContent.classList.value = 
            "leaflet-marker-level" + level // level
            + (options.isGroup ? " leaflet-marker-group" : "") // group of several markers
        ;


        //console.log(size);
        var element = d3.select(divContent);
        //console.log(element)
        var svg = element.append("svg");
        svg.attr("width", size).attr("height", size);
        //svg.classList.add("leaflet-marker-item");

        // circle
        svg.append("circle")
            .attr("cx", center)
            .attr("cy", center)
            .attr("r", rCircle)
            // moved to css
            //.attr("fill", this.getColor(level))
            //.attr("fill-opacity", 0.9)
            //.attr("stroke-width", strokeWidth)
            //.attr("stroke", "black");

        // value label
        svg.append("text")
            .html(this.formatValue(options.values.value, level))
            .attr("x", "50%")
            .attr("y", "50%")
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("dy", "0.3em")
            .attr("font-family", "Arial");
            // moved to css
            //.attr("fill", "white")

        if(options.values.value != null && options.values.value != 0) {
        //var values = { a: 0.5, b: 0.3, c: 0.2 };
        // moved to css
        //var color = d3.scaleOrdinal()
        //    .domain(options.values.subvalues)
        //    .range(this.donutColors);
        var pie = d3.pie().value(function(d) { return d[1]; });
        var values_ready = pie(Object.entries(options.values.subvalues));
        // donut chart
        svg.append("g")
            .attr("transform", "translate(" + size / 2 + "," + size / 2 + ")")
            .selectAll("abc")
            .data(values_ready)
            .enter()
            .append("path")
            .attr("d", d3.arc()
            .innerRadius(size/4+6)
            .outerRadius(size/2)
            )
            // moved to css
            .attr('class', function(d, i) { return "leaflet-marker-donut" + (i % 3 + 1); })
            //.attr('fill', function(d) { return(color(d.data.key)) })
            //.attr("stroke-width", "0px")
            //.attr("opacity", 0.8)
            ;
        }

        /*const icon = <svg width={size} height={size}>
            <circle cx={center} cy={center} r={rCircle} fill={this.getColor(level)} fillOpacity="0.8" strokeWidth={strokeWidth} stroke="black" />
            <text x="50%" y="50%" textAnchor="middle" fill="white"
                fontSize="12px" dy="0.3em" fontFamily="Arial">{this.formatValue(options.countryValue, level)}</text>
        </svg>;
        //div.innerHTML = "<b>1</b>";
        ReactDOM.render(icon, divContent);*/

        if (options.bgPos) {
            var bgPos = point(options.bgPos);
            div.style.backgroundPosition = (-bgPos.x) + 'px ' + (-bgPos.y) + 'px';
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
class DotLayerTool extends AbstractLayerTool {

    /**
     * It creates a new tool with respect to the props.
     * 
     * @param {*} props 
     */
    constructor(props) {
        super(props);

        this.categoryFilters = [];
    }

    /**
     * A unique string of the tool type.
     */
    static TYPE() {
        return "geovisto-tool-layer-dot";
    }

    /**
     * It creates a copy of the uninitialized tool.
     */
    copy() {
        return new DotLayerTool(this.getProps());
    }

    /**
     * It creates new defaults of the tool.
     */
    createDefaults() {
        return new DotLayerToolDefaults();
    }

    /**
     * It returns default tool state.
     */
    createState() {
        return new DotLayerToolState();
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
        return new DotLayerToolTabControl({ tool: this });
    }

    /**
     * It creates layer items.
     */
    createLayerItems() {
        // create layer which clusters points
        let layer = L.layerGroup([]);
         //let layer = L.markerClusterGroup({
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
        let latDataDomain = mapData.getDataDomain(dataMapping[dataMappingModel.latitude.name]);
        let longDataDomain = mapData.getDataDomain(dataMapping[dataMappingModel.longitude.name]);
        let categoryDataDomain = mapData.getDataDomain(dataMapping[dataMappingModel.category.name]);
        let foundLats, foundLongs, foundCategories;
        let data = this.getMap().getState().getCurrentData();
        let dataLen = data.length;
        for (let i = 0; i < dataLen; i++) {
            // find the 'lat' properties
            foundLats = mapData.getItemValues(latDataDomain, data[i]);

            // find the 'long' properties
            foundLongs = mapData.getItemValues(longDataDomain, data[i]);

            // find the 'category' properties
            foundCategories = mapData.getItemValues(categoryDataDomain, data[i]);

            let resultItem;
            if (foundLats.length === 1 && foundLongs.length === 1) {
                resultItem = {lat: foundLats[0], long: foundLongs[0]};
            }

            if (foundCategories.length === 1) {
                resultItem.category = foundCategories[0];
                for (let j = 0; j < this.categoryFilters.length; j++) {
                    const filter = this.categoryFilters[j];
                    if (filter.operation(resultItem.category, filter.value)) {
                        resultItem.color = filter.color;

                        break;
                    }
                }
            }

            if (resultItem !== undefined) {
                workData.push(resultItem);
            }

            // // since the data are flattened we can expect max one found item
            // //console.log("abc", highlightedIds);
            // if(foundLats.length == 1 && (highlightedIds.length == 0 || highlightedIds.indexOf(foundLats[0]) >= 0)) {
            //     // test if country respects highlighting selection
            //     /*if(highlightedIds != undefined) {
            //         console.log(highlightedIds.indexOf(foundCountries[0]) >= 0);
            //     }*/
            //
            //     // test if country exists in the map
            //     geoCountry = centroids.find(x => x.id == foundLats[0]);
            //     if(geoCountry != undefined) {
            //         // test if country exists in the results array
            //         actResultItem = workData.find(x => x.id == foundLats[0]);
            //         if(actResultItem == undefined) {
            //             actResultItem = { id: foundLats[0], value: 0, subvalues: {} };
            //             workData.push(actResultItem);
            //         }
            //         // initialize category if does not exists yet
            //         if(foundCategories.length == 1) {
            //             if(actResultItem.subvalues[foundCategories[0]] == undefined) {
            //                 actResultItem.subvalues[foundCategories[0]] = 0;
            //             }
            //         }
            //         // set value with respect to the aggregation function
            //         if(dataMapping[dataMappingModel.aggregation.name] == "sum") {
            //             // test if value is valid
            //             if(foundLongs.length == 1 && foundLongs[0] != null && typeof foundLongs[0] === 'number') {
            //                 actResultItem.value += foundLongs[0];
            //                 // set category
            //                 if(foundCategories.length == 1) {
            //                     actResultItem.subvalues[foundCategories[0]] += foundLongs[0];
            //                 }
            //             }
            //         } else {
            //             // count
            //             actResultItem.value++;
            //             // incerement category value
            //             actResultItem.subvalues[foundCategories[0]]++;
            //         }
            //     }
            // }
        }
        //console.log("result: ", preparedData);
        return workData;
    }

    /**
     * Creates dot symbol
     *
     * @param data
     * @returns {Circle}
     */
    createDot(data) {
        // TODO set color based on Category colour passed in data
        let point = L.circle([data.lat, data.long], {
            radius: 10,
            weight: 0,
            fillOpacity: 1.0,
            color: data.color ?? 'green'
        });
        return point;
    }

    /**
     * It creates markers using workData
     */
    createMarkers(workData) {
        // create markers
        let markers = [];

        let geoCountry;
        let layer = this.getState().getLayer();
        let centroids = this.getState().getCentroids();
        for(let i = 0; i < workData.length; i++) {
            let point = this.createDot(workData[i]);
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
    createMarker(centroid, data) {
        function thousands_separator(num)
          {
            var num_parts = num.toString().split(".");
            num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            return num_parts.join(".");
          }

        // build popup message
        let popupMsg = "<b>" + centroid.name + "</b><br>";
        popupMsg += (data.value != null ? thousands_separator(data.value) : "N/A") + "<br>";
        for(let [key, value] of Object.entries(data.subvalues)) {
            popupMsg += key + ": " + thousands_separator(value) + "<br>";
        }

        // create marker
        let point = L.marker([centroid.lat, centroid.long], {
            // create basic icon 
            id: centroid.name,
            icon: new CountryIcon( {
                values: data
            } ) 
        }).bindPopup(popupMsg);
        return point;
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
            let markers = this.createMarkers(workData);

            // update state
            this.getState().setMarkers(markers);
        }
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

export default DotLayerTool;