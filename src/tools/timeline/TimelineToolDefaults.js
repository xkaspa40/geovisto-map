import TimelineTool from './TimelineTool';
import AutocompleteSidebarInput from '../../inputs/input/AutocompleteSidebarInput';
import CheckboxSidebarInput from '../../inputs/input/CheckboxSidebarInput';
import { AbstractLayerToolDefaults } from '../layers/abstract';
import LabeledTextSidebarInput from "../../inputs/input/LabeledTextSidebarInput";

/**
 * TODO: refactorization needed!
 */
const TYPE = 'timeline';

const INPUT_ID_PREFIX = "geovisto-input-" + TYPE;

/**
 * Data mapping model which can be used in the sidebar form.
 */
const MAPPING_MODEL = {
    timePath: {
        id: `${INPUT_ID_PREFIX}-time_path`,
        name: "timePath",
        label: "Time path*",
        input: AutocompleteSidebarInput.ID()
    },
    stepTimeLength: {
        id: `${INPUT_ID_PREFIX}-step_time`,
        name: "stepTimeLength",
        label: "Step time (ms)*",
        input: LabeledTextSidebarInput.ID()
    },
    transitionTimeLength: {
        id: `${INPUT_ID_PREFIX}-transition_time`,
        name: "transitionTimeLength",
        label: "Transition time (ms)*",
        input: LabeledTextSidebarInput.ID()
    },
    realTimeEnabled: {
        id: `${INPUT_ID_PREFIX}-real_time`,
        name: "realTimeEnabled",
        label: "Real time",
        input: CheckboxSidebarInput.ID()
    },
    granularity: {
        id: `${INPUT_ID_PREFIX}-granularity`,
        name: "granularity",
        label: "Granularity",
        options: ["hour", "day", "week", "month", "year"],
        input: AutocompleteSidebarInput.ID()
    },
    chartEnabled: {
        id: `${INPUT_ID_PREFIX}-chart`,
        name: "chartEnabled",
        label: "Chart",
        input: CheckboxSidebarInput.ID()
    },
    chartValuePath: {
        id: `${INPUT_ID_PREFIX}-chart`,
        name: "chartValuePath",
        label: "Chart value path",
        input: AutocompleteSidebarInput.ID()
    },
    chartAggregationFn: {
        id: `${INPUT_ID_PREFIX}-chart_value_path`,
        name: "chartAggregationFn",
        label: "Aggregation",
        input: AutocompleteSidebarInput.ID(),
        options: ["sum", "average"],
    }
}

/**
 * This class provide functions which return the default state values.
 *
 * @author Jiri Hynek
 */
class TimelineToolDefaults extends AbstractLayerToolDefaults {

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
        return TimelineTool.TYPE();
    }

    /**
     * It returns the layer name.
     */
    getLayerName() {
        return "Timeline";
    }

    /**
     * It returns the default mapping of data domains to chart dimensions.
     */
    getDataMapping() {
        let dataMapping = {};

        let dataMappingModel = this.getDataMappingModel();

        dataMapping[dataMappingModel.timePath.name] = null;
        dataMapping[dataMappingModel.stepTimeLength.name] = 1000;
        dataMapping[dataMappingModel.transitionTimeLength.name] = 2500;
        dataMapping[dataMappingModel.realTimeEnabled.name] = false;
        dataMapping[dataMappingModel.granularity.name] = null;
        dataMapping[dataMappingModel.chartEnabled.name] = false;
        dataMapping[dataMappingModel.chartValuePath.name] = null;
        dataMapping[dataMappingModel.chartAggregationFn.name] = null;

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
    getPolygons() {
        return this.getMapObject().getMap().getState().getPolygons();
    }

    /**
     * It returns preferred z index for the choropoleth layer
     */
    getZIndex() {
        return 350;
    }
}
export default TimelineToolDefaults;
