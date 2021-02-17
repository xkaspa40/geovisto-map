import AbstractEvent from "../../../model/event/abstract/AbstractEvent";
import AbstractTool from "../../../model/tool/abstract/AbstractTool";
import LayerTabControl from "./sidebar/AbstractLayerToolTabControl";
import LayerToolDefaults from "./AbstractLayerToolDefaults";
import LayerToolState from "./AbstractLayerToolState";

/**
 * This class wraps filter tool. It provides methods for layer management.
 * 
 * @author Jiri Hynek
 */
class AbstractLayerTool extends AbstractTool {

    /**
     * It creates a new tool with respect to the props.
     * 
     * @param {*} props 
     */
    constructor(props) {
        super(props);

        // the tab control for a sidebar will be created only if needed
        this.tabControl = undefined;
    }

    /**
     * A unique string of the tool type.
     */
    static TYPE() {
        return "geovisto-tool-layer-abstract";
    }

    /**
     * It creates a copy of the uninitialized tool.
     */
    copy() {
        return new LayerTool(this.getProps());
    }

    /**
     * It creates new defaults of the tool.
     */
    createDefaults() {
        return new LayerToolDefaults();
    }

    /**
     * It returns default tool state.
     */
    createState() {
        return new LayerToolState();
    }

    /**
     * It returns tab control with respect to the configuration
     */
    getSidebarTabControl() {
        if(this.tabControl == undefined) {
            this.tabControl = this.createSidebarTabControl();
        }
        return this.tabControl;
    }

    /**
     * It creates new tab control.
     * 
     * This function can be extended.
     */
    createSidebarTabControl() {
        return new LayerTabControl({ tool: this });
    }

    /**
     * It creates new layer with respect to configuration
     */
    create() {
        if(this.isEnabled()) {
            this.showLayerItems();
        }
    }

    /**
     * It changes layer state to enabled/disabled.
     * 
     * @param {*} enabled
     */
    setEnabled(enabled) {
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
    showLayerItems() {
        // get/create items
        let layerItems = this.getLayerItems();

        // render/remove items
        for(let j = 0; j < layerItems.length; j++) {
            layerItems[j].addTo(this.getMap().getState().getLeafletMap());
        }

        // post create items
        this.postCreateLayerItems();
    }

    /**
     * Help function which hides layer items
     * 
     * This function is meant to be private.
     */
    hideLayerItems() {
        // get/create items
        let layerItems = this.getLayerItems();

        // render/remove items
        for(let j = 0; j < layerItems.length; j++) {
            this.getMap().getState().getLeafletMap().removeLayer(layerItems[j]);
        }
    }

    /**
     * It returns layer items which should be rendered.
     */
    getLayerItems() {
        if(this.layerItems == undefined) {
            this.layerItems = this.createLayerItems();
        }
        return this.layerItems;
    }

    /**
     * It creates layer items.
     * 
     * Override this function.
     */
    createLayerItems() {
        return [];
    }

    /**
     * This function is called when layer items are rendered.
     * 
     * Override this function if needed.
     */
    postCreateLayerItems() {
    }

    /**
     * It updates data mapping and redraws the layer.
     * It can be used by the layer tab providers when input values are changed.
     * 
     * @param {*} dataMapping 
     */
    updateDataMapping(dataMapping, onlyStyle) {
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
     * @param {*} onlyStyle 
     */
    redraw(onlyStyle) {
    }

    /**
     * This function is called when a custom event is invoked.
     * 
     * Override this function if needed.
     * 
     * @param {AbstractEvent} event 
     */
    handleEvent(event) {
    }
}
export default AbstractLayerTool;