import AbstractLayerToolState from "../abstract/AbstractLayerToolState";
import SpikeLayerToolDefaults from "./SpikeLayerToolDefaults";
import FiltersToolDefaults from "../../filters/FiltersToolDefaults";

/**
 * This class provide functions for using the state of the layer tool.
 * 
 * @author Petr Kaspar
 */
class SpikeLayerToolState extends AbstractLayerToolState {

    /**
     * It creates a tool state.
     */
    constructor() {
        super();
        this.categoryFilters = [];
        this.filterManager = new FiltersToolDefaults().getFiltersManager();
    }

    /**
     * It resets state with respect to initial props. Optionally, defaults can be set if property is undefined.
     * 
     * @param {SpikeLayerToolDefaults} defaults
     */
    reset(defaults) {
        super.reset(defaults);

        // the layer tool properties
        this.setMarkers([]);
        // TODO
    }

    /**
     * Help function which initialize state properties realated with map.
     */
    resetMapVariables(map, defaults) {
        super.resetMapVariables(map, defaults);

        let props = this.getProps();
    }

    /**
     * The metod takes config and desrializes the values.
     * 
     * @param {*} config 
     */
    deserialize(config) {
        super.deserialize(config);

        if ( ! config.categoryFilters) {
            return;
        }

        let filters = [];
        config.categoryFilters.forEach((filter) => {
            const operation = this.getFilterManager().getOperation(filter.operation)[0];
            if (operation) {
                filters.push({
                    operation,
                    value: filter.value,
                    color: filter.color
                });
            }
        })
        config.categoryFilters = filters;
        this.setCategoryFilters(config.categoryFilters);
    }

    /**
     * The method serializes the tool state. Optionally, defaults can be set if property is undefined.
     * 
     * @param {SpikeLayerToolDefaults} defaults
     */
    serialize(defaults) {
        let config = super.serialize(defaults);
        config.categoryFilters = [];

        this.categoryFilters.forEach((filter) => {
            config.categoryFilters.push({
                operation: filter.operation.toString(),
                value: filter.value,
                color: filter.color
            });
        })

        return config;
    }

    /**
     * It returns a Leaflet layer group.
     */
    getLayer() {
        return this.layer;
    }

    /**
     * It sets a Leaflet layer group.
     * 
     * @param {L.layerGroup} layer 
     */
    setLayer(layer) {
        this.layer = layer;
    }

    /**
     * It returns the markers.
     */
    getMarkers() {
        return this.markers;
    }

    /**
     * It sets the markers.
     * 
     * @param {*} markers 
     */
    setMarkers(markers) {
        this.markers = markers;
    }

    /**
     * Filter manager getter
     *
     * @returns {FiltersManager}
     */
    getFilterManager() {
        return this.filterManager;
    }

    /**
     * Sets rules for category colors
     *
     * @param rules
     */
    setCategoryFilters(rules) {
        this.categoryFilters = rules;
        this.categoryFilters = rules ?? [];
    }

    /**
     * Gets rules for category colors
     *
     * @returns {[]}
     */
    getCategoryFilters() {
        return this.categoryFilters;
    }
}
export default SpikeLayerToolState;