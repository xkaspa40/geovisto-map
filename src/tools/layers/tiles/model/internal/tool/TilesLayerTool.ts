import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import AbstractLayerTool from '../../../../../../model/internal/layer/AbstractLayerTool';
import ITilesLayerTool from '../../types/tool/ITilesLayerTool';
import ITilesLayerToolProps from '../../types/tool/ITilesLayerToolProps';
import ITilesLayerToolDefaults from '../../types/tool/ITilesLayerToolDefaults';
import TilesLayerToolDefaults from './TilesLayerToolDefaults';
import ITilesLayerToolState from '../../types/tool/ITilesLayerToolState';
import TilesLayerToolState from './TilesLayerToolState';
import { ISidebarTab, ILayerToolSidebarTab, ISidebarTabControl } from '../../../../../sidebar';
import TilesLayerToolSidebarTab from '../sidebar/TilesLayerToolSidebarTab';
import IMapEvent from '../../../../../../model/types/event/IMapEvent';
import { ThemesToolEvent, IMapTheme } from '../../../../../themes';
import IMapChangeEvent from '../../../../../../model/types/event/IMapChangeEvent';

/**
 * This class represents Map layer tool. It use tile layer and OSM maps.
 * 
 * @author Jiri Hynek
 */
class TilesLayerTool extends AbstractLayerTool implements ITilesLayerTool, ISidebarTabControl {
    
    private sidebarTab: ILayerToolSidebarTab | undefined;

    /**
     * It creates a new tool with respect to the props.
     * 
     * @param props 
     */
    public constructor(props: ITilesLayerToolProps | undefined) {
        super(props);
    }

    /**
     * A unique string of the tool type.
     */
    public static TYPE(): string {
        return "geovisto-tool-layer-map"; 
    }

    /**
     * It creates a copy of the uninitialized tool.
     */
    public copy(): ITilesLayerTool {
        return new TilesLayerTool(this.getProps());
    }

    /**
     * Help function which returns the props given by the programmer.
     */
    public getProps(): ITilesLayerToolProps {
        return this.getProps();
    }

    /**
     * It returns default values of the state properties.
     */
    public getDefaults(): ITilesLayerToolDefaults {
        return <ITilesLayerToolDefaults> super.getDefaults();
    }

    /**
     * It creates new defaults of the layer tool.
     */
    protected createDefaults(): ITilesLayerToolDefaults {
        return new TilesLayerToolDefaults(this);
    }

    /**
     * It returns the layer tool state.
     */
    public getState(): ITilesLayerToolState {
        return <ITilesLayerToolState> super.getState();
    }

    /**
     * It creates new defaults of the layer tool.
     */
    protected createState(): ITilesLayerToolState {
        return new TilesLayerToolState(this);
    }

    /**
     * It returns a sidebar tab with respect to the configuration.
     */
    public getSidebarTab(): ISidebarTab {
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
        return new TilesLayerToolSidebarTab(this, {
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
    protected createLayerItems(): L.Layer[] {
        // create a tile layer
        const layer: L.TileLayer = this.createTileLayer(this.getState().getBaseMap());

        // update state
        this.getState().setTileLayer(layer);

        return [ layer ];
    }

    /**
     * Creates new tile layer
     * 
     * TODO: do not use constant attribution.
     * 
     * @param tileID 
     */
    protected createTileLayer(tileID: string): L.TileLayer {
        // ----------------- TODO: refactorization needed
        const layer: L.TileLayer = L.tileLayer(tileID, {    
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19,
            minZoom: 1,
        });
        return layer;
    }

    /**
     * This function is called when a custom event is invoked.
     * 
     * @param event 
     */
    public handleEvent(event: IMapEvent): void {
        if(event.getType() == ThemesToolEvent.TYPE()) {
            this.onThemeChange(<IMapTheme> (<IMapChangeEvent> event).getChangedObject());
        }
    }

    /**
     * This function updates theme used in the tool.
     */
    protected onThemeChange(theme: IMapTheme): void {
        // update base map
        this.getState().setBaseMap(theme.getBaseMap());

        let layer: L.TileLayer | undefined = this.getState().getTileLayer();
        // TODO: remove the any type
        if(layer && (layer as any)._url != theme.getBaseMap()) {
            // remove the old layer
            const map = this.getMap().getState().getLeafletMap();
            if(map) {
                map.removeLayer(layer);

                // create a new tile layer
                layer = this.createTileLayer(this.getState().getBaseMap());

                // update state
                this.getState().setTileLayer(layer);

                // add the new layer to the leaflet map
                layer.addTo(map);
            }
        }
    }
}

export default TilesLayerTool;