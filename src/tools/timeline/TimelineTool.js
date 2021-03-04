import { add as addTime, compareAsc } from "date-fns";
// import FiltersUtil, { FilterFunction } from '../../util/FilterUtil';
import { IntervalFunction, TimeInterval } from "./contants";
import { TimelineService } from "./TimelineService";
import { TimelineControl } from "./TimelineControl";
import AbstractLayerTool from "../layers/abstract/AbstractLayerTool";
import TimelineToolTabControl from "./sidebar/TimelineToolTabControl";
import TimelineToolDefaults from "./TimelineToolDefaults";
import TimelineToolState from "./TimelineToolState";
import {
    EqFilterOperation,
    FiltersManager,
    FiltersTool,
    GreaterThanEqualFilterOperation,
    GreaterThanFilterOperation,
    LessThanFilterOperation
} from "../filters";
import TimeChangeEvent from "./model/TimeChangeEvent";
import { LatLng } from "leaflet";
import TimeInitializedEvent from "./model/TimeInitializedEvent";


export class TimelineTool extends AbstractLayerTool {
    constructor(props, container, config) {
        super(props);
        // this.container = container;
        // this.config = config;

        this.tabControl = undefined;
        this.timeline = undefined;
        this.timelineControl = undefined;
        this.enabled = false;

        this.initializeTimeline = this.initializeTimeline.bind(this);
        this.desctructTimeline = this.desctructTimeline.bind(this);
    }

    /**
     * A unique string of the tool type.
     */
    static TYPE() {
        return "geovisto-tool-timeline";
    }

    /**
     * It creates a copy of the uninitialized tool.
     */
    copy() {
        return new TimelineTool(this.getProps());
    }

    /**
     * It creates new defaults of the tool.
     */
    createDefaults() {
        return new TimelineToolDefaults();
    }

    /**
     * It returns default tool state.
     */
    createState() {
        return new TimelineToolState();
    }

    /**
     * It creates new tab control.
     */
    createSidebarTabControl() {
        return new TimelineToolTabControl({ tool: this });
    }

    /**
     * It creates settings tool
     */
    create() {
        if (this.config) {
            // creates tab control
            this.getTabControl();
            // if enabled, render layer items and add to maps
            this.setState(this.config.enabled === undefined ? false : this.config.enabled);
        }
    }

    /**
     * It returns tab control with respect to the configuration
     */
    getTabControl() {
        if (
            this.tabControl === undefined &&
            this.container.getSidebar() !== undefined &&
            !this.config.disableSidebar
        ) {
            this.tabControl = new TimelineToolTabControl(this);
            this.tabControl.create(!!this.config.enabled);
        }
        return this.tabControl;
    }

    /**
     * It exports serializable configuration.
     */
    exportConfig() {
        return {
            disableSidebar: this.config.disableSidebar,
        };
    }

    setState(enabled) {
        if (enabled !== this.enabled) {
            if (enabled) {
                this.unfilteredActData = this.container.actData;
            }
            if (!enabled && this.timelineControl) {
                this.container.filterData([]);
                this.container.getMap().removeControl(this.timelineControl);
                this.timelineControl = null;
                this.getMap().updateData(this.unfilteredActData);
            }
            this.enabled = enabled;
        }
    }

    calculateTimes() {
        const data = this.getMap().getState().getMapData().getOriginalData();
        const { timePath, realTimeEnabled, granularity } = this.formState;
        let times = data.map(record => record[timePath]);
        times = [...new Set(times)];
        times = times.map(time => new Date(time));
        times = times.sort(compareAsc);

        if (!realTimeEnabled) return times;

        const getEachTimeOfInterval = IntervalFunction[granularity];
        const interval = getEachTimeOfInterval({ start: times[0], end: times[times.length - 1] });
        return interval;
    }

    onCurrentTimeChange({ currentTimeIndex, state }) {
        if (state) {
            const leafletMap = this.getMap().getState().getLeafletMap();
            leafletMap.flyTo(
                new LatLng(state.latitude, state.longitude),
                state.zoom,
                { duration: this.formState.transitionTimeLength / 1000 }
            );
            setTimeout(() => {
                this.getMap()
                    .updateData(this.data.values.get(this.times[currentTimeIndex]), "timeline");
                // create and dispatch event
                this.getMap()
                    .dispatchEvent(new TimeChangeEvent(this.data.values.get(this.times[currentTimeIndex])));
            }, this.formState.transitionTimeLength);
        } else {
            this.getMap()
                .updateData(this.data.values.get(this.times[currentTimeIndex]), "timeline");
            // create and dispatch event
            this.getMap()
                .dispatchEvent(new TimeChangeEvent(this.data.values.get(this.times[currentTimeIndex])));
        }
    }


    /**
     * Help function which acquires and returns the filtering tool if available.
     */
    getFiltersTool() {
        if (this.filtersTool == undefined) {
            let tools = this.getMap().getState().getTools().getByType(FiltersTool.TYPE());
            if (tools.length > 0) {
                this.filtersTool = tools[0];
            }
        }
        return this.filtersTool;
    }

    getFilteredData(currentTimeIndex) {
        const { timePath, realTimeEnabled, granularity } = this.formState;
        const currentTime = this.times[currentTimeIndex];
        const filterManager = new FiltersManager([
            new GreaterThanEqualFilterOperation(),
            new GreaterThanFilterOperation(),
            new LessThanFilterOperation(),
            new EqFilterOperation(),
        ])
        const dataDomain = this.getMap().getState().getMapData().getDataDomain(timePath)
        const filterRules = [
            ...this.getFiltersTool().getState().getFilterRules(),
            ...realTimeEnabled ?
                [
                    filterManager.createRule({
                        dataDomain,
                        label: ">=",
                        pattern: currentTime,
                        transformValue: (value) => new Date(value),
                    }),
                    filterManager.createRule({
                        dataDomain,
                        label: "<",
                        pattern: addTime(currentTime, { [TimeInterval[granularity]]: 1 }),
                        transformValue: (value) => new Date(value),
                    }),
                ] :
                [
                    filterManager.createRule({
                        dataDomain,
                        label: "==",
                        pattern: currentTime.getTime(),
                        transformValue: (value) => (new Date(value)).getTime(),
                    }),
                ],
        ]

        let mapData = this.getMap().getState().getMapData();
        const filteredData = filterManager.filterData(mapData, mapData.getData(), filterRules);
        return filteredData;
    }

    createData(times) {
        return {
            values: new Map(times.map((time, index) => [time, this.getFilteredData(index)])),
            charts: this.formState.chartEnabled ?
                [
                    {
                        path: this.formState.chartValuePath,
                        aggregationFn: this.formState.chartAggregationFn,
                    }
                ] :
                null,
        };
    }

    initializeTimeline(formState) {
        this.formState = formState;
        this.times = this.calculateTimes();
        this.data = this.createData(this.times);
        this.timelineService = TimelineService.create(
            this.formState.stepTimeLength,
            this.formState.transitionTimeLength,
            this.times,
            this.data
        )
        this.timelineService.onCurrentTimeIndexChanged.subscribe(this.onCurrentTimeChange.bind(
            this));
        if (!this.timelineControl) {
            this.timelineControl = TimelineControl.create(
                this.timelineService,
                this.getMap().getState().getLeafletMap()
            )
                .addTo(this.getMap().getState().getLeafletMap());
            this.getMap().dispatchEvent(new TimeChangeEvent(this.data.values.get(this.times[0])));
        } else {
            this.timelineControl.remove();
            this.timelineControl = TimelineControl.create(
                this.timelineService,
                this.getMap().getState().getLeafletMap()
            )
                .addTo(this.getMap().getState().getLeafletMap());
        }
        this.getMap()
            .dispatchEvent(new TimeInitializedEvent({ stepTimeLength: this.formState.stepTimeLength }));
    }

    desctructTimeline() {
        this.timelineControl.remove();
        this.timelineControl = null;

        this.getFiltersTool();
        let mapData = this.getMap().getState().getMapData();
        const filteredData = this.filtersTool.getState()
            .getFiltersManager()
            .filterData(mapData, mapData.getData(), this.filtersTool.getState().getFilterRules())
        this.getMap().updateData(filteredData);
    }
}

export default TimelineTool;
