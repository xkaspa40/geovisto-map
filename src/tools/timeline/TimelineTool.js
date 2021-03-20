import { compareAsc } from "date-fns";
import { IntervalFunction } from "./contants";
import { TimelineService } from "./TimelineService";
import { TimelineControl } from "./TimelineControl";
import AbstractLayerTool from "../layers/abstract/AbstractLayerTool";
import TimelineToolTabControl from "./sidebar/TimelineToolTabControl";
import TimelineToolDefaults from "./TimelineToolDefaults";
import TimelineToolState from "./TimelineToolState";
import { FiltersTool } from "../filters";
import TimeChangeEvent from "./model/TimeChangeEvent";
import { LatLng } from "leaflet";
import TimeInitializedEvent from "./model/TimeInitializedEvent";
import DataChangeEvent from "../../model/event/basic/DataChangeEvent";
import { TimeDestroyedEvent } from "./model/TimeDestroyedEvent";


export class TimelineTool extends AbstractLayerTool {
    constructor(props, container, config) {
        super(props);

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
                // this.getMap().updateData(this.unfilteredActData);
            }
            this.enabled = enabled;
        }
    }

    calculateTimes() {
        const data = this.getMap().getState().getCurrentData();
        const { timePath, realTimeEnabled, granularity } = this.formState;
        let times = data.map(record => record[timePath]);
        times = [...new Set(times)];
        times = times.map(time => new Date(time));
        times = times.sort(compareAsc);

        if (!realTimeEnabled) return times.map(d => d.getTime());

        const getEachTimeOfInterval = IntervalFunction[granularity];
        const interval = getEachTimeOfInterval({ start: times[0], end: times[times.length - 1] });
        return interval.map(d => d.getTime());
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

    createData() {
        const values = new Map(this.times.map((time) => [time, []]));

        const getTimeStamp = (time) => {
            const timeStamp = new Date(time).getTime()
            if (this.times.includes(timeStamp)) return timeStamp;

            return this.times.find((time, index) => {
                if (index === this.times.length - 1) return true;
                return timeStamp > time && timeStamp < this.times[index + 1]
            });
        }
        console.log(this.getMap().getState().getCurrentData());
        this.getMap().getState().getCurrentData().forEach((item) => {
            const timeStamp = getTimeStamp(item[this.formState.timePath]);
            values.set(timeStamp, [...values.get(timeStamp), item]);
        });

        return {
            values,
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

    onStoryChange(storyConfig) {
        this.getState().saveStory({
            name: this.formState.story.name,
            config: [...storyConfig.keys()].map(key => ({
                time: new Date(key).toISOString(),
                ...storyConfig.get(key),
            }))
        })
    }

    initializeTimeline(formState) {
        this.formState = formState;
        this.times = this.calculateTimes();
        this.data = this.createData();
        this.timelineService = new TimelineService({
            stepTimeLength: this.formState.stepTimeLength,
            transitionTimeLength: this.formState.storyEnabled ?
                this.formState.transitionTimeLength :
                null,
            times: this.times,
            data: this.data,
        })
        this.timelineService.onCurrentTimeIndexChanged.subscribe(this.onCurrentTimeChange.bind(
            this));
        if (!this.timelineControl) {
            this.timelineControl = TimelineControl.create(
                this.timelineService,
                this.getMap().getState().getLeafletMap()
            )
                .addTo(this.getMap().getState().getLeafletMap());
        } else {
            this.timelineControl.remove();
            this.timelineControl = TimelineControl.create(
                this.timelineService,
                this.getMap().getState().getLeafletMap()
            )
                .addTo(this.getMap().getState().getLeafletMap());
        }
        if (this.formState.storyEnabled) {
            this.timelineService.setStory(
                new Map(this.formState.story.config.map(({
                    time,
                    ...config
                }) => [new Date(time).getTime(), config]))
            );
        }
        this.timelineService.onStoryChanged.subscribe(this.onStoryChange.bind(this));
        this.getMap()
            .dispatchEvent(new TimeInitializedEvent({ stepTimeLength: this.formState.stepTimeLength }));
        this.getMap().dispatchEvent(new TimeChangeEvent(this.data.values.get(this.times[0])));
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
        this.getMap().dispatchEvent(new TimeDestroyedEvent())
    }

    handleEvent(event) {
        if (!this.timelineControl) return;

        if (event.getType() === DataChangeEvent.TYPE()) {
            if (event.getSource() === "timeline") return;
            this.initializeTimeline(this.formState)
        }
    }
}

export default TimelineTool;
