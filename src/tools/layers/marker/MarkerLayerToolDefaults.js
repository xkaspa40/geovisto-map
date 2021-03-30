import MarkerLayerTool from "./MarkerLayerTool";
import AbstractLayerToolDefaults from "../abstract/AbstractLayerToolDefaults";
import AutocompleteSidebarInput from "../../../inputs/input/AutocompleteSidebarInput";

/**
 * TODO: refactorization needed!
 */
const TYPE = 'marker';

const INPUT_ID_PREFIX = "geovisto-input-" + TYPE;

/**
 * Data mapping model which can be used in the sidebar form.
 */
const MAPPING_MODEL = {
    country: {
        id: INPUT_ID_PREFIX + "-input-country",
        name: "country",
        label: "Country",
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
    },
    category: {
        id: INPUT_ID_PREFIX + "-input-category",
        name: "category",
        label: "Category",
        input: AutocompleteSidebarInput.ID()
    }
}

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class MarkerLayerToolDefaults extends AbstractLayerToolDefaults {

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
        return MarkerLayerTool.TYPE();
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

        dataMapping[dataMappingModel.country.name] = implicitDataDomainLabel;
        dataMapping[dataMappingModel.value.name] = implicitDataDomainLabel;
        dataMapping[dataMappingModel.aggregation.name] = dataMappingModel.aggregation.options[0];
        dataMapping[dataMappingModel.category.name] = implicitDataDomainLabel;

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
export default MarkerLayerToolDefaults;