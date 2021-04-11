import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './style/choroplethLayer.scss'
import AbstractLayerTool from '../../../../../../model/internal/layer/AbstractLayerTool';
import ChoroplethLayerToolState from './ChoroplethLayerToolState';
import ChoroplethLayerToolDefaults from './ChoroplethLayerToolDefaults';
import ChoropolethLayerToolSidebarTab from '../sidebar/ChoroplethLayerToolSidebarTab';
import ThemesToolEvent from '../../../../../themes/model/internal/event/ThemesToolEvent';
import SelectionToolEvent from '../../../../../selection/model/internal/event/SelectionToolEvent';
import DataChangeEvent from '../../../../../../model/internal/event/data/DataChangeEvent';
import IChoroplethLayerTool from '../../types/tool/IChoroplethLayerTool';
import IChoroplethLayerToolProps from '../../types/tool/IChoroplethLayerToolProps';
import IChoroplethLayerToolDefaults from '../../types/tool/IChoroplethLayerToolDefaults';
import IChoroplethLayerToolState from '../../types/tool/IChoroplethLayerToolState';
import { TOOL as SELECTION_TOOL, ISelectionTool, IMapSelection } from '../../../../../selection';
import { ILayerToolSidebarTab, ISidebarTabControl } from '../../../../../sidebar';
import IMapDataDomain from '../../../../../../model/types/data/IMapDataDomain';
import IChoroplethLayerToolDimensions from '../../types/tool/IChoroplethLayerToolDimensions';
import IMapAggregationFunction from '../../../../../../model/types/aggregation/IMapAggregationFunction';
import IMapAggregationBucket from '../../../../../../model/types/aggregation/IMapAggregationBucket';
import IMapEvent from '../../../../../../model/types/event/IMapEvent';
import IMapDataManager from '../../../../../../model/types/data/IMapDataManager';

/**
 * This class represents Choropleth layer tool. It works with geojson polygons representing countries.
 * 
 * @author Jiri Hynek
 */
class ChoroplethLayerTool extends AbstractLayerTool implements IChoroplethLayerTool, ISidebarTabControl {

    private selectionTool: ISelectionTool | undefined;
    private sidebarTab: ILayerToolSidebarTab | undefined;

    /**
     * It creates a new tool with respect to the props.
     * 
     * @param props 
     */
    public constructor(props: IChoroplethLayerToolProps) {
        super(props);
    }

    /**
     * It creates a copy of the uninitialized tool.
     */
    public copy(): IChoroplethLayerTool {
        return new ChoroplethLayerTool(this.getProps());
    }

    /**
     * It returns the props given by the programmer.
     */
    public getProps(): IChoroplethLayerToolProps {
        return <IChoroplethLayerToolProps> super.getProps();
    }

    /**
     * It returns default values of the state properties.
     */
    public getDefaults(): IChoroplethLayerToolDefaults {
        return <IChoroplethLayerToolDefaults> super.getDefaults();
    }

    /**
     * It creates new defaults of the tool.
     */
    public createDefaults(): IChoroplethLayerToolDefaults {
        return new ChoroplethLayerToolDefaults(this);
    }

    /**
     * It returns the layer tool state.
     */
    public getState(): IChoroplethLayerToolState {
        return <IChoroplethLayerToolState> super.getState();
    }

    /**
     * It returns default tool state.
     */
    public createState(): IChoroplethLayerToolState {
        return new ChoroplethLayerToolState(this);
    }

    /**
     * Help function which acquires and returns the selection tool if available.
     */
    private getSelectionTool(): ISelectionTool | undefined {
        if(this.selectionTool == undefined) {
            const tools = this.getMap()?.getState().getTools().getByType(SELECTION_TOOL.getType());
            if(tools.length > 0) {
                this.selectionTool = <ISelectionTool> tools[0];
            }
        }
        return this.selectionTool;
    }

    /**
     * It returns a sidebar tab with respect to the configuration.
     */
    public getSidebarTab(): ILayerToolSidebarTab {
        if(this.sidebarTab == undefined) {
            this.sidebarTab = this.createSidebarTabControl();
        }
        return this.sidebarTab;
    }

    /**
     * It creates new tab control.
     */
    protected createSidebarTabControl(): ILayerToolSidebarTab {
        // override if needed
        return new ChoropolethLayerToolSidebarTab(this, {
            // defined by the sidebar tab defaults
            id: undefined,
            enabled: undefined,
            name: undefined,
            icon: undefined,
            checkButton: undefined
        });
    }

    /**
     * It creates layer items.
     */
    public createLayerItems(): L.Layer[] {
        const map: L.Map | undefined = this.getMap()?.getState().getLeafletMap();
        if(map) {
            //var _this = this;

            // ----------------- TODO: refactorization needed

            const thousands_separator = (num: number): string => {
                const num_parts = num.toString().split(".");
                num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                return num_parts.join(".");
            };
        
            // TODO specify the types
            const mouseOver = (e: any): any => {
                const layerItem: any = e.target;
                this.getState().setHoveredItem(layerItem.feature.id);
                this.updateItemStyle(layerItem);
                const popupText: string = "<b>" + e.target.feature.name + "</b><br>"
                                    + this.getState().getDimensions().aggregation.getDomain()?.getName() + ": "
                                    + thousands_separator(e.target.feature.value ?? 0);
                e.target.bindTooltip(popupText,{className: 'leaflet-popup-content', sticky: true}).openTooltip();
            
                if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                    layerItem.bringToFront();
                }
            };
        
            // TODO specify the types
            const mouseOut = (e: any): any => {
                const layerItem: any = e.target;
                this.getState().setHoveredItem(undefined);
                this.updateItemStyle(layerItem);
                (this.getState().getPopup() as any).update();

                if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                    layerItem.bringToBack();
                }
            };
        
            // TODO specify the types
            const click = (e: any): any => {
                //_this.getMap().getState().getLeafletMap().fitBounds(e.target.getBounds());
                //console.log("fire click event");
                // notify selection tool
                const selectionTool: ISelectionTool | undefined = this.getSelectionTool();
                if(selectionTool) {
                    const selection: IMapSelection = SELECTION_TOOL.getSelection(this, [ e.target.feature.id ]);
                    //console.log("select:", selection, selection.equals(selectionTool.getState().getSelection()));
                    if(selection.equals(selectionTool.getState().getSelection())) {
                        this.getSelectionTool()?.setSelection(null);
                    } else {
                        this.getSelectionTool()?.setSelection(selection);
                    }
                }
            };
        
            // TODO specify the types
            const onEachFeature = (feature: any, layer: any): any => {
                layer.on({
                    mouseover: mouseOver,
                    mouseout: mouseOut,
                    click: click
                });
            };
        
            const paneId: string = this.getId();
            const pane: HTMLElement | undefined = this.getMap()?.getState().getLeafletMap()?.createPane(paneId);
            if(pane) {
                pane.style.zIndex = this.getState().getZIndex().toString();
                // create Choropleth layer
                const layer = L.geoJSON(this.getState().getPolygons(), {
                    onEachFeature: onEachFeature,
                    pane: this.getId()
                });
                //layer._layerComponent = this;
            
                // create info control that shows country info on hover
                // TODO specify the types
                const layerPopup: any = L.control();
            
                // TODO specify the types
                layerPopup.onAdd = function (map: any) {
                    this._div = L.DomUtil.create('div', 'info');
                    this.update();
                    return this._div;
                };
            
                // TODO specify the types
                layerPopup.update = function (props: any) {
                    this.innerHTML =  (props ?
                        '<b>' + props.name + '</b><br />' + props.value + '</sup>'
                        : 'Hover over a state');
                };

                // update state
                this.getState().setGeoJSONLayer(layer);
                this.getState().setPopup(layerPopup);
            
                return [ layer, layerPopup ];
            }
        }
        return [];
    }

    /**
     * It updates polygons so they represent current data.
     */
    protected processData(): Map<string, IMapAggregationBucket> {
        // initialize a hash map of aggreation buckets
        const bucketMap = new Map<string, IMapAggregationBucket>();

        // get dimensions
        const dimensions: IChoroplethLayerToolDimensions = this.getState().getDimensions();
        const geoDimension: IMapDataDomain | undefined = dimensions.geo.getDomain();
        const valueDimension: IMapDataDomain | undefined = dimensions.value.getDomain();
        const aggregationDimension: IMapAggregationFunction | undefined = dimensions.aggregation.getDomain();

        // test whether the dimension are set
        if(geoDimension && valueDimension && aggregationDimension) {
            // and go through all data records
            const mapData: IMapDataManager = this.getMap().getState().getMapData();
            const data: any[] = this.getMap().getState().getCurrentData();
            const dataLen: number = data.length;
            let foundGeos: any[], foundValues: any[];
            let aggregationBucket: IMapAggregationBucket | undefined;
            for (let i = 0; i < dataLen; i++) {
                // find the 'geo' properties of data record
                foundGeos = mapData.getDataRecordValues(geoDimension,  data[i]);
                // since the data are flattened we can expect max one found item
                if(foundGeos.length == 1) {
                    // get aggregation bucket for the country or create a new one
                    aggregationBucket = bucketMap.get(foundGeos[0]);
                    // test if country exists in the map
                    if(!aggregationBucket) {
                        bucketMap.set(foundGeos[0], aggregationDimension.getAggregationBucket());
                    }
                    // find the 'value' properties
                    foundValues = mapData.getDataRecordValues(valueDimension, data[i]);
                    
                    // since the data are flattened we can expect max one found item
                    aggregationBucket?.addValue(foundValues.length == 1 ? foundValues[0] : 0);
                }   
            }
        }

        // updates bucket data
        this.getState().setBucketData(bucketMap);

        return bucketMap;
    }

    /**
     * This function is called when layer items are rendered.
     */
    public postCreateLayerItems(): void {
        if(this.getState().getGeoJSONLayer()) {
            this.updateStyle();
        }
    }

    /**
     * It reloads data and redraw the layer.
     */
    public redraw(onlyStyle: boolean): void {
        if(!onlyStyle) {
            // combine geo with data
            this.processData();
        }

        // update style
        this.updateStyle();
    }

    /**
     * This function is called when a custom event is invoked.
     * 
     * @param event 
     */
    public handleEvent(event: IMapEvent): void {
        if(event.getType() == DataChangeEvent.TYPE()) {
            // data change
            this.redraw(false);
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
     * It updates style of all layer features using the current template.
     */
    protected updateStyle(): void {
        this.getState().getGeoJSONLayer()?.eachLayer((item: L.Layer) => {
            this.updateItemStyle(item);
        });
    }

    /**
     * It updates style of the given feature using the current template.
     * 
     * TODO: specify the type
     */
    protected updateItemStyle(item: any): void {
        //item.setStyle(this.computeStyle(item));
        if(item._path != undefined) {
            // modify classes
            item._path.classList.value = this.computeStyleClasses(item).join(" ");
        }
    }

    /**
     * It returns style classes for the current template and given feature.
     * 
     * TODO: specify the types.
     */
    protected computeStyleClasses(item: any): string[] {
        const classList: string[] = [ "leaflet-interactive", "leaflet-choropleth-item-basic" ];

        const feature: any = item.feature;

        // compute color level
        classList.push(this.computeColorClass(this.getState().getBucketData().get(feature.id)?.getValue() ?? 0));

        // hovered
        if(this.getState().getHoveredItem() == feature.id) {
            classList.push("leaflet-choropleth-item-hover");
        }

        // selected / highlighted
        const selection: IMapSelection | null | undefined = this.getSelectionTool()?.getState().getSelection() ?? undefined;
        const selectedIds: string[] = selection?.getIds() ?? [];
        if(selection && selectedIds.length > 0) {
            if(selectedIds.includes(feature.id)) {
                if(selection.getTool() == this && selection.getSrcIds().includes(feature.id)) {
                    // selected
                    classList.push("leaflet-choropleth-item-select");
                } else {
                    // affected, highlighted
                    classList.push("leaflet-choropleth-item-highlight");
                }
            } else {
                // de-emphasize others
                classList.push("leaflet-choropleth-item-deempasize");
            }
        }

        return classList;
    }

    /**
     * It returns color class for the current template and given value.
     */
    protected computeColorClass(val: number): string {
        const scale = this.getDefaults().getScale();
        return val > scale[6] ? "leaflet-choropleth-item-clr8" :
                val > scale[5] ? "leaflet-choropleth-item-clr7" :
                val > scale[4] ? "leaflet-choropleth-item-clr6" :
                val > scale[3] ? "leaflet-choropleth-item-clr5" :
                val > scale[2] ? "leaflet-choropleth-item-clr4" :
                val > scale[1] ? "leaflet-choropleth-item-clr3" :
                val > scale[0] ? "leaflet-choropleth-item-clr2" :
                "leaflet-choropleth-item-clr1";
    }

}

export default ChoroplethLayerTool;
