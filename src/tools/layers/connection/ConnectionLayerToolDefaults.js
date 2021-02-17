import ConnectionLayerTool from "./ConnectionLayerTool";
import AbstractLayerToolDefaults from "../abstract/AbstractLayerToolDefaults";
import AutocompleteSidebarInput from "../../../inputs/input/AutocompleteSidebarInput";

/**
 * TODO: refactorization needed!
 */
const TYPE = 'connection';

const INPUT_ID_PREFIX = "geovisto-input-" + TYPE;

/**
 * Data mapping model which can be used in the sidebar form.
 */
const MAPPING_MODEL = {
    from: {
        id: INPUT_ID_PREFIX + "-from",
        name: "from",
        label: "From",
        input: AutocompleteSidebarInput.ID()
    },
    to: {
        id: INPUT_ID_PREFIX + "-to",
        name: "to",
        label: "To",
        input: AutocompleteSidebarInput.ID()
    }
}


/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class ConnectionLayerToolDefaults extends AbstractLayerToolDefaults {

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
        return ConnectionLayerTool.TYPE();
    }

    /**
     * It returns the layer name.
     */
    getLayerName() {
        return "Connection layer";
    }

    /**
     * It returns the default mapping of data domains to chart dimensions.
     */
    getDataMapping() {
        let dataMapping = {};
        
        let dataMappingModel = this.getDataMappingModel();
        let implicitDataDomainLabel = this.getMapObject().getMap().getState().getMapData().getDataDomainLabels()[0];
        
        dataMapping[dataMappingModel.from.name] = implicitDataDomainLabel;
        dataMapping[dataMappingModel.to.name] = implicitDataDomainLabel;

        return dataMapping;
    }

    /**
     * It returns the data mapping model.
     */
    getDataMappingModel() {
        return MAPPING_MODEL;
    }
    
    /**
     * It returns optiomal zoom for D3 projections.
     */
    getProjectionZoom() {
        return 2;
    }
    
    /**
     * It returns default centroids.
     */
    getCentroids() {
        return JSON.parse(JSON.stringify(this.getMapObject().getMap().getState().getCentroids()));
    }
}
export default ConnectionLayerToolDefaults;