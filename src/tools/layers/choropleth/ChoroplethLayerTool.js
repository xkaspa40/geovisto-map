import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './style/choroplethLayer.scss'
import AbstractLayerTool from '../abstract/AbstractLayerTool';
import ChoroplethLayerToolState from './ChoroplethLayerToolState';
import ChoroplethLayerToolDefaults from './ChoroplethLayerToolDefaults';
import ChoropolethLayerToolTabControl from './sidebar/ChoroplethLayerToolTabControl';
import ThemesToolEvent from '../../themes/model/event/ThemesToolEvent';
import SelectionToolEvent from '../../selection/model/event/SelectionToolEvent';
import DataChangeEvent from '../../../model/event/basic/DataChangeEvent';
import MapSelection from '../../selection/model/item/generic/MapSelection';
import SelectionTool from '../../selection/SelectionTool';

// TODO: move to defaults
const COLOR_orange = ['#8c8c8c','#ffffcc','#ffff99','#ffcc99','#ff9966','#ff6600','#ff0000','#cc0000'];
const COLOR_red = ['#8c8c8c','#FED976','#FEB24C','#FD8D3C','#FC4E2A','#E31A1C','#BD0026','#800026'];
const COLOR_blue = ['#8c8c8c','#edf8b1','#c7e9b4','#7fcdbb','#41b6c4','#1d91c0','#225ea8','#0c2c84'];

const FillColor = "#cc0000";

var DYNAMIC_SCALE = [];
const SCALE = [1, 100, 1000, 10000, 100000, 1000000, 10000000];

/**
 * This class represents Choropleth layer tool. It works with geojson polygons representing countries.
 * 
 * @author Jiri Hynek
 */
class ChoroplethLayerTool extends AbstractLayerTool {

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
        return "geovisto-tool-layer-choropleth"; 
    }

    /**
     * It creates a copy of the uninitialized tool.
     */
    copy() {
        return new ChoroplethLayerTool(this.getProps());
    }

    /**
     * It creates new defaults of the tool.
     */
    createDefaults() {
        return new ChoroplethLayerToolDefaults();
    }

    /**
     * It returns default tool state.
     */
    createState() {
        return new ChoroplethLayerToolState();
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
        return new ChoropolethLayerToolTabControl({ tool: this });
    }

    /**
     * It creates layer items.
     */
    createLayerItems() {
        var _this = this;

        // ----------------- TODO: refactorization needed

        function thousands_separator(num) {
            var num_parts = num.toString().split(".");
            num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            return num_parts.join(".");
        }
       
        let mouseOver = function(e) {
            let layerItem = e.target;
            _this.getState().setHoveredItem(layerItem.feature.id);
            _this.updateItemStyle(layerItem);
            var popup = "<b>" + e.target.feature.name + "</b>";
            if(e.target.feature.value != undefined){
                popup += "<br>";
                if (_this.getState().getDataMapping()[_this.getDefaults().getDataMappingModel().aggregation.name] == "sum") {
                    popup+= "sum: ";
                    popup+=thousands_separator(e.target.feature.value);

                } else {
                    popup+=thousands_separator(e.target.feature.value);
                    if (e.target.feature.value>1){
                        popup+= " records";
                    } else {
                        popup+= " record";
                    }
                }
            }
            e.target.bindTooltip(popup,{className: 'leaflet-popup-content', sticky: true}).openTooltip();
        
            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layerItem.bringToFront();
            }
        }
    
        let mouseOut = function(e) {
            let layerItem = e.target;
            _this.getState().setHoveredItem(undefined);
            _this.updateItemStyle(layerItem);
            _this.getState().getLayerPopup().update();

            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layerItem.bringToBack();
            }
        }
    
        let click = function(e) {
            //_this.getMap().getState().getLeafletMap().fitBounds(e.target.getBounds());
            //console.log("fire click event");
            // notify selection tool
            let selectionTool = _this.getSelectionTool();
            if(selectionTool) {
                let selection = new MapSelection(_this, [ e.target.feature.id ]);
                //console.log("select:", selection, selection.equals(selectionTool.getState().getSelection()));
                if(selection.equals(selectionTool.getState().getSelection())) {
                    _this.getSelectionTool().setSelection(SelectionTool.EMPTY_SELECTION());
                } else {
                    _this.getSelectionTool().setSelection(selection);
                }
            }
        }
    
        let onEachFeature = function(feature, layer) {
            layer.on({
                mouseover: mouseOver,
                mouseout: mouseOut,
                click: click
            });
        }
    
        // combine geo with data
        this.updatePolygons(this);
    
        var paneId = this.getId();
        let pane = this.getMap().getState().getLeafletMap().createPane(paneId);
        pane.style.zIndex = this.getState().getZIndex();
        // create Choropleth layer
        let layer = L.geoJSON(this.getState().getPolygons(), {
            onEachFeature: onEachFeature,
            pane: paneId
        });
        //layer._layerComponent = this;
    
        // create info control that shows country info on hover
        let layerPopup = L.control();
    
        layerPopup.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info');
            this.update();
            return this._div;
        };
    
        layerPopup.update = function (props) {
            this.innerHTML =  (props ?
                '<b>' + props.name + '</b><br />' + props.value + '</sup>'
                : 'Hover over a state');
        };

        // update state
        this.getState().setLayer(layer);
        this.getState().setLayerPopup(layerPopup);
    
        return [ layer, layerPopup ];
    }

    /**
     * It updates polygons so they represent current data.
     */
    updatePolygons() {
        //console.log("updating map data", this);

        // delete the 'value' property of every geo feature object if defined
        let polygons = this.getState().getPolygons();
        // TODO create new map and do not modify polygons structure
        for (var i = 0; i < polygons.length; i++) {
            polygons[i].value = undefined;
        }

        // set a new value of the 'value' property of every geo feature
        let geoCountry;
        let data = this.getMap().getState().getCurrentData();
        let dataLen = data.length;
        let mapData = this.getMap().getState().getMapData();
        let dataMappingModel = this.getDefaults().getDataMappingModel();
        let dataMapping = this.getState().getDataMapping();
        let countryDataDomain = mapData.getDataDomain(dataMapping[dataMappingModel.country.name]);
        let valueDataDomain = mapData.getDataDomain(dataMapping[dataMappingModel.value.name]);
        //console.log(countryDataDomain, valueDataDomain);
        let foundCountries, foundValues;
        //console.log(data);
        for (let i = 0; i < dataLen; i++) {
            // find the 'country' properties
            foundCountries = mapData.getItemValues(countryDataDomain,  data[i]);
            //console.log("search: ", countryDataDomain, data[i], foundCountries);
            //console.log("search: ", foundCountries);
            // find the 'value' properties
            foundValues = mapData.getItemValues(valueDataDomain, data[i]);
            //console.log("search: ", foundValues);

            // since the data are flattened we can expect max one found item
            if(foundCountries.length == 1) {
                geoCountry = polygons.find(x => x.id == foundCountries[0]);
                // test if country exists in the map
                if(geoCountry != undefined) {
                    // initilizace map country value property
                    if(geoCountry.value == undefined) {
                        geoCountry.value = 0;
                    }
                    // set value with respect to the aggregation function
                    if(dataMapping[dataMappingModel.aggregation.name] == "sum") {
                        if(foundValues.length == 1 && foundValues[0] != null && typeof foundValues[0] === 'number') {
                            geoCountry.value += foundValues[0];
                        }
                    } else {
                        // count
                        geoCountry.value++;
                    }
                }
            }   
        }
    }

    /**
     * This function is called when layer items are rendered.
     */
    postCreateLayerItems() {
        if(this.getState().getLayer()) {
            this.updateStyle();
        }
    }

    /**
     * It reloads data and redraw the layer.
     */
    redraw(onlyStyle) {
        if(!onlyStyle) {
            // combine geo with data
            this.updatePolygons();
        }

        // update style
        this.updateStyle();
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
            // selection change
            this.redraw(true);
        } else if(event.getType() == ThemesToolEvent.TYPE()) {
            // theme change
            this.redraw(true);
        }
    }

    // ----------------- TODO: refactorization needed

    /**
     * It returns scale.
     */
    getScale() {
        return SCALE;
    }

    getDynamicScale(){
        return DYNAMIC_SCALE;
    }

    /**
     * It returns color style for the current template.
     * 
     * @deprecated
     */
    getColors() {
        let dataMappingModel = this.getDefaults().getDataMappingModel();
        let dataMapping = this.getState().getDataMapping();
        if(dataMapping[dataMappingModel.color.name] == 'red') {
            return COLOR_red;
        } else if(dataMapping[dataMappingModel.color.name] == 'blue') {
            return COLOR_blue;
        }
            return COLOR_orange;
    }

    /**
     * It returns color value for the current template and given value.
     * 
     * @deprecated
     */
    computeColor(val) {
        let colors = this.getColors();
        let scale = this.getScale();
        return val > scale[6] ? colors[7] :
                val > scale[5] ? colors[6] :
                val > scale[4] ? colors[5] :
                val > scale[3] ? colors[4] :
                val > scale[2] ? colors[3] :
                val > scale[1] ? colors[2] :
                val > scale[0] ? colors[1] :
                colors[0];
    }

    /**
     * It returns color class for the current template and given value.
     */
    computeColorClass(val) {

        for (let i = DYNAMIC_SCALE.length-1; i >= 0; i--) {
            if (val >= DYNAMIC_SCALE[i]){
                return "leaflet-choropleth-item-clr"+(i+2);
            }            
        }
        return "leaflet-choropleth-item-clr1";
    }

    computeColorIntensity(val) {
        for (let i = DYNAMIC_SCALE.length-1; i >= 0; i--) {
            if (val >= DYNAMIC_SCALE[i]){
                return ((i+1)/(DYNAMIC_SCALE.length)).toFixed(2);                
            }            
        }
        return 0.9;
    }    

    /**
     * It returns style for the current template and given feature.
     * 
     * @deprecated
     */
    computeStyle(item) {       
        let feature = item.feature;
        let hoveredItem = this.getState().getHoveredItem();
        let selection = this.getSelectionTool() ? this.getSelectionTool().getState().getSelection() : undefined;
        return {
            weight: hoveredItem == feature.id ? 4 : 2,
            opacity: 0.7,
            color: hoveredItem == feature.id ? "yellow":"white",
            dashArray: hoveredItem == feature.id ? '' : '1',
            fillOpacity: hoveredItem == feature.id ? 0.9 : 0.8,
            fillColor: selection != null ?
                        (selection.getTool() == this && selection.getSrcIds().includes(feature.id) ? 'orange' :
                        (selection.getIds().includes(feature.id) ? 'yellow' : '#8c8c8c'))
                        : this.computeColor(feature.value)
        };
    }

    /**
     * It returns style classes for the current template and given feature.
     */
    computeStyleClasses(item) {
        let classList = [ "leaflet-interactive", "leaflet-choropleth-item-basic" ];

        let feature = item.feature;
        var _this = this;
        let dataMappingModel = _this.getDefaults().getDataMappingModel();
        let dataMapping = _this.getState().getDataMapping();  
        if(dataMapping.strategy == dataMappingModel.strategy.options[0]){
            if(feature.value == undefined){
                item._path.style.fill = "grey";
                item._path.style.fillOpacity = 0.3;
            }
            else{          
                item._path.style.fill = dataMapping.color;
                item._path.style.fillOpacity = this.computeColorIntensity(feature.value);
            } 
        }
        else{
            item._path.style.fill = null;
            item._path.style.fillOpacity = null;            
            classList.push(this.computeColorClass(feature.value));
        }

        // compute color level

        // hovered
        if(this.getState().getHoveredItem() == feature.id) {
            classList.push("leaflet-choropleth-item-hover")
        }

        // selected / highlighted
        let selection = this.getSelectionTool() ? this.getSelectionTool().getState().getSelection() : undefined;
        let selectedIds = selection.getIds();
        if(selection && selectedIds.length > 0) {
            item._path.style.fill = null;
            item._path.style.fillOpacity = null;
            if(selectedIds.includes(feature.id)) {
                if(selection.getTool() == this && selection.getSrcIds().includes(feature.id)) {
                    // selected
                    classList.push("leaflet-choropleth-item-select")
                } else {
                    // affected, highlighted
                    classList.push("leaflet-choropleth-item-highlight")
                }
            } else {
                // de-emphasize others
                classList.push("leaflet-choropleth-item-deempasize")
            }
        }


        return classList;
    }

    /**
     * It updates style of the given feature using the current template.
     */
    updateItemStyle(item) {
        //item.setStyle(this.computeStyle(item));
        if(item._path != undefined) {
            // modify classes
            item._path.classList.value = this.computeStyleClasses(item).join(" ");
        }
    }

    /**
     * It updates style of all layer features using the current template.
     */
    updateStyle() {
        if(this.getState().getLayer()) {
            var _this = this;
            let dataMappingModel = _this.getDefaults().getDataMappingModel();
            let dataMapping = _this.getState().getDataMapping();  
            var rangeInputValue = dataMapping.range;            
            var nonSortedValues=[]
            DYNAMIC_SCALE=[];
            //getting all values
            this.getState().getLayer().eachLayer(function(item){
                nonSortedValues.push(item.feature.value);
            });  
            //filter 'undefined' values from array
            var filteredValues = nonSortedValues.filter(function (e){
                return e != undefined;
            });


            //relative [0-max]
            if(dataMapping.scaling == dataMappingModel.scaling.options[1]){
                filteredValues.sort(function(a, b){return a - b});
                var step = filteredValues[filteredValues.length-1]/rangeInputValue;  
                DYNAMIC_SCALE.push(0);                                  
                for (let i = 1; i < rangeInputValue; i++) {
                    DYNAMIC_SCALE.push(step*i);                    
                }
                console.log(DYNAMIC_SCALE);

            }

            //irelative [min-max]
            else if(dataMapping.scaling == dataMappingModel.scaling.options[2]){
                filteredValues.sort(function(a, b){return a - b});
                var step = (filteredValues[filteredValues.length-1]-filteredValues[0])/rangeInputValue;  
                DYNAMIC_SCALE.push(filteredValues[0]);                                  
                for (let i = 1; i < rangeInputValue; i++) {
                    DYNAMIC_SCALE.push(step*i);                    
                }
                console.log(DYNAMIC_SCALE);

            }

            //median (sort values)
            else if (dataMapping.scaling == dataMappingModel.scaling.options[3]){
                filteredValues.sort(function(a, b){return a - b});            
                DYNAMIC_SCALE=[filteredValues[0]];
                for (var i=1; i<rangeInputValue;i++){
                    DYNAMIC_SCALE.push(filteredValues[Math.round(filteredValues.length/rangeInputValue*(i))]);
                }
            }

           else{
                let tmp = this.getScale();
                for (let i = 0; i < rangeInputValue; i++) {
                    DYNAMIC_SCALE.push(tmp[i]);
                    
                }
            }            



            //sort numeric array 
            
            //getting dynamic scales: [0], [length/7*1], [length/7*2], [length/7*3], [length/7*4], [length/7*5], [length/7*6]           


            this.getState().getLayer().eachLayer(function(item) {
                _this.updateItemStyle(item);
            });
        }
    }

}

export default ChoroplethLayerTool;
