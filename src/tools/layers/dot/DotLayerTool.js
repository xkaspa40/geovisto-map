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
        }

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