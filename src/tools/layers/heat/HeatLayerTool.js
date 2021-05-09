import L from 'leaflet';
import LL from 'leaflet.markercluster';
import H from 'leaflet.heat';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import './style/heatLayer.scss';
import HeatLayerToolTabControl from './sidebar/HeatLayerToolTabControl';
import HeatLayerToolDefaults from './HeatLayerToolDefaults';
import HeatLayerToolState from './HeatLayerToolState';
import SelectionTool from '../../selection/SelectionTool';
import AbstractLayerTool from '../abstract/AbstractLayerTool';
import ThemesToolEvent from '../../themes/model/event/ThemesToolEvent';
import SelectionToolEvent from '../../selection/model/event/SelectionToolEvent';
import DataChangeEvent from '../../../model/event/basic/DataChangeEvent';

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
        this.workData = [];
        this.options = {};
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
        let layer = L.layerGroup([]);

        // update state
        this.getState().setLayer(layer);

        this.redraw();

        this.getMap().getState().getLeafletMap().on('zoomend', (e) => this.changeHeatRadius(e, this.options));

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

    prepareHeatmapOptions() {
        let options = {};
        const dataMapping = this.getState().getDataMapping();
        const dataMappingModel = this.getDefaults().getDataMappingModel();
        let radius = dataMapping[dataMappingModel.radius.name];
        if (isNaN(radius) || radius === '') {
            return options;
        }
        radius = parseInt(radius);

        let blur = dataMapping[dataMappingModel.blur.name];
        if (isNaN(blur) || blur === '') {
            return options;
        }
        blur = parseInt(blur);

        const gradient = this.getState().getGradient(dataMapping[dataMappingModel.gradient.name]);
        const zoom = this.getState().getZoomLevel(dataMapping[dataMappingModel.zoom.name]);
        if ( ! gradient || ! zoom) {
            return options;
        }
        options = {radius, blur, gradient, zoom};

        return options;
    }

    /**
     * It prepares data for markers.
     */
    prepareMapData() {
        // prepare data
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
        let workData = [];

        for (let i = 0; i < dataLen; i++) {
            foundLats = mapData.getItemValues(latitudeDataDoman, data[i]);
            if (foundLats.length !== 1 || isNaN(foundLats[0])) {
                foundLats = [];
            }
            foundLongs = mapData.getItemValues(longitudeDataDomain, data[i]);
            if (foundLongs.length !== 1 || isNaN(foundLongs[0])) {
                foundLongs = [];
            }
            foundIntensity = mapData.getItemValues(intensityDataDomain, data[i]);
            if (foundIntensity.length !== 1 || isNaN(foundIntensity[0])) {
                foundIntensity = [];
            }

            if (foundLats.length === 1 && foundLongs.length === 1 && foundIntensity.length === 1) {
                workData.push([foundLats[0],foundLongs[0], foundIntensity[0]]);
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

            // prepare heat map options
            this.options = this.prepareHeatmapOptions();
            if ( ! onlyStyle) {
                // prepare data
                this.workData = this.prepareMapData();
            }

            let data = this.workData;
            if ( ! Object.keys(this.options).length) {

                // don't put any points on map if heat map options aren't specified
                data = [];
            }

            const workData = {...this.options, data: data};
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

        if ( ! workData.data.length) {
            return layers;
        }

        let data = workData.data;
        const zoom = this.getMap().getState().getLeafletMap()._zoom;
        const radius = this.getRadius(zoom, workData);
        console.log(workData);
        layers.push(L.heatLayer(data,
            {
                radius: radius,
                maxZoom: workData.zoom,
                blur: workData.blur,
                minOpacity: 0.4,
                gradient: workData.gradient,
                max: this.maxValue,
            })
        );

        return layers;
    }

    changeHeatRadius(e, options) {
        const zoom = e.target._zoom;
        const heatLayer = this.getState().getLayers()[0];
        if ( ! options.blur || ! options.radius || ! options.gradient || ! options.zoom) {
            return;
        }
        const radius = this.getRadius(zoom, options);

        heatLayer.setOptions({
            radius: radius,
            maxZoom: options.zoom,
            blur: options.blur,
            minOpacity: 0.4,
            gradient: options.gradient,
            max: this.maxValue,
        });

        heatLayer.redraw();
    }

    getRadius(zoom, options) {
        let rules = this.getState().getReactiveRadiusRules();
        rules = rules.filter(rule => rule.operation.match(zoom, rule.value));

        let radius = options.radius;
        if (rules.length) {
            //get last value of all rulesets that match
            radius = rules[rules.length - 1].radius;
        }

        return radius;
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