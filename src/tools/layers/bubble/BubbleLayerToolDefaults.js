import BubbleLayerTool from "./BubbleLayerTool";
import AbstractLayerToolDefaults from "../abstract/AbstractLayerToolDefaults";
import AutocompleteSidebarInput from "../../../inputs/input/AutocompleteSidebarInput";

const TYPE = 'marker';

const INPUT_ID_PREFIX = "geovisto-input-" + TYPE;

/**
 * Data mapping model which can be used in the sidebar form.
 */
const MAPPING_MODEL = {
    latitude: {
        id: INPUT_ID_PREFIX + "-input-latitude",
        name: "latitude",
        label: "Latitude",
        input: AutocompleteSidebarInput.ID()
    },
    longitude: {
        id: INPUT_ID_PREFIX + "-input-longitude",
        name: "longitude",
        label: "Longitude",
        input: AutocompleteSidebarInput.ID()
    },
    category: {
        id: INPUT_ID_PREFIX + "-input-category",
        name: "category",
        label: "Category",
        input: AutocompleteSidebarInput.ID()
    },
    value: {
      id: INPUT_ID_PREFIX + "-input-value",
      name: "value",
      label: "Value",
      input: AutocompleteSidebarInput.ID()
    },
    aggregation: {
        id: INPUT_ID_PREFIX + "-input-aggregation",
        name: "aggregation",
        label: "Agregation",
        options: ["count", "sum"],
        input: AutocompleteSidebarInput.ID()
    }
}

/**
 * This class provide functions which return the default state values.
 * 
 * @author Petr Kaspar
 */
class BubbleLayerToolDefaults extends AbstractLayerToolDefaults {

    /**
     * It initializes tool defaults.
     */
    constructor() {
        super();
    }

    /**
     * It returns a unique type string of the tool which is based on the layer it wraps.
     */
    getType() {
        return BubbleLayerTool.TYPE();
    }

    /**
     * It returns the layer name.
     */
    getLayerName() {
        return "Marker layer";
    }

    /**
     * It returns the default mapping of data domains to chart dimensions.
     */
    getDataMapping() {
        let dataMapping = {};

        let dataMappingModel = this.getDataMappingModel();
        let implicitDataDomainLabel = this.getMapObject().getMap().getState().getMapData().getDataDomainLabels()[0];

        dataMapping[dataMappingModel.latitude.name] = implicitDataDomainLabel;
        dataMapping[dataMappingModel.longitude.name] = implicitDataDomainLabel;
        dataMapping[dataMappingModel.category.name] = implicitDataDomainLabel;
        dataMapping[dataMappingModel.value.name] = implicitDataDomainLabel;
        dataMapping[dataMappingModel.aggregation.name] = dataMappingModel.aggregation.options[0];

        return dataMapping;
    }

    /**
     * It returns the data mapping model.
     */
    getDataMappingModel() {
        return MAPPING_MODEL;
    }

    /**
     * It returns default centroids.
     */
    getCentroids() {
        return JSON.parse(JSON.stringify(this.getMapObject().getMap().getState().getCentroids()));
    }
}
export default BubbleLayerToolDefaults;