import MapTool from "../tool/MapTool";
import ILayerTool from "../../types/layer/ILayerTool";
import ILayerToolSidebarTab from "../../../tools/sidebar/model/types/tab/layer/ILayerToolSidebarTab";
import ILayerToolProps from "../../types/layer/ILayerToolProps";
import ILayerToolDefaults from "../../types/layer/ILayerToolDefaults";
import ILayerToolState from "../../types/layer/ILayerToolState";
import LayerToolDefaults from "./LayerToolDefaults";
import LayerToolState from "./LayerToolState";

/**
 * This class wraps filter tool. It provides methods for layer management.
 * 
 * @author Jiri Hynek
 */
abstract class AbstractLayerTool extends MapTool implements ILayerTool {

    /**
     * It creates a new tool with respect to the props.
     * 
     * @param props 
     */
    public constructor(props: ILayerToolProps | undefined) {
        super(props);
    }

    /**
     * A unique string of the tool type.
     */
    public static TYPE(): string {
        return "geovisto-tool-layer-abstract";
    }

    /**
     * It creates a copy of the uninitialized layer tool.
     */
    public abstract copy(): ILayerTool;

    /**
     * Help function which returns the props given by the programmer.
     */
    public getProps(): ILayerToolProps {
        return this.getProps();
    }

    /**
     * It returns default values of the state properties.
     */
    public getDefaults(): ILayerToolDefaults {
        return <ILayerToolDefaults> super.getDefaults();
    }

    /**
     * It creates new defaults of the layer tool.
     */
    protected createDefaults(): ILayerToolDefaults {
        return new LayerToolDefaults(this);
    }

    /**
     * It returns the layer tool state.
     */
    public getState(): ILayerToolState {
        return <ILayerToolState> super.getState();
    }

    /**
     * It creates new defaults of the layer tool.
     */
    protected createState(): ILayerToolState {
        return new LayerToolState(this);
    }

    /**
     * It creates new tab control.
     * 
     * This function can be extended.
     */
    protected abstract createSidebarTabControl(): ILayerToolSidebarTab

    /**
     * It creates new layer with respect to configuration
     */
    public create(): void {
        if(this.isEnabled()) {
            this.showLayerItems();
        }
    }

    /**
     * It changes layer state to enabled/disabled.
     * 
     * @param enabled
     */
    public setEnabled(enabled: boolean): void {
        if(enabled != this.isEnabled()) {
            // update state
            this.getState().setEnabled(enabled);

            // show ot hide the layer
            if(enabled) {
                this.showLayerItems();
            } else {
                this.hideLayerItems();
            }
        }
    }

    /**
     * Help function which shows layer items.
     * 
     * This function is meant to be private.
     */
    protected showLayerItems(): void {
        const map = this.getMap().getState().getLeafletMap();
        if(map) {
            // get/create items
            const layerItems = this.getLayerItems();

            // render/remove items
            for(let j = 0; j < layerItems.length; j++) {
                layerItems[j].addTo(map);
            }

            // post create items
            this.postProcessLayerItems();
        }
    }

    /**
     * Help function which hides layer items
     * 
     * This function is meant to be private.
     */
    protected hideLayerItems(): void {
        const map = this.getMap().getState().getLeafletMap();

        // render/remove items
        if(map) {
            // get/create items
            const layerItems = this.getLayerItems();
            for(let j = 0; j < layerItems.length; j++) {
                map.removeLayer(layerItems[j]);
            }
        }
    }

    /**
     * It returns layer items which should be rendered.
     */
    public getLayerItems(): L.Layer[] {
        let layerItems = this.getState().getLayerItems();
        if(layerItems == undefined) {
            layerItems = this.createLayerItems();
        }
        return layerItems;
    }

    /**
     * It creates layer items.
     * 
     * Override this function.
     */
    protected abstract createLayerItems(): L.Layer[];

    /**
     * This function is called when layer items are rendered.
     * 
     * Override this function if needed.
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected postProcessLayerItems(): void {
    }

    /**
     * It updates data mapping and redraws the layer.
     * It can be used by the layer tab providers when input values are changed.
     * 
     * @param dataMapping 
     * @param onlyStyle
     */
    public setDataMapping(dataMapping: any, onlyStyle: boolean): void {
        // update state
        this.getState().setDataMapping(dataMapping);

        // redraw the layer items
        this.redraw(onlyStyle);
    }

    /**
     * It reloads data and redraw the layer.
     * 
     * Override this function.
     * 
     * @param onlyStyle 
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    public redraw(onlyStyle: boolean): void {
    }
}
export default AbstractLayerTool;