import L, { ControlOptions } from "leaflet";
import { OnTimesChangedParams, TimelineComponent } from "./TimelineComponent";
import { StoryState, TimelineService } from "./TimelineService";

import "./TimelineControl.scss";

export class TimelineControl extends L.Control {
    private readonly timelineService: TimelineService;
    private readonly leafletMap: any;
    private readonly formState: any;

    constructor(
        timelineService: TimelineService,
        leafletMap: any,
        formState: any,
        options: ControlOptions = { position: "bottomleft" },
    ) {
        super(options);
        this.timelineService = timelineService;
        this.leafletMap = leafletMap;
        this.formState = formState;
    }

    onAdd(): HTMLElement {
        const container = L.DomUtil.create("div", "leaflet-timeline");
        L.DomEvent.disableClickPropagation(container);

        const props = {
            ...this.timelineService.getState(),
            onPlayClick: this.timelineService.togglePlay.bind(this.timelineService),
            onRecordClick: ({
                stepTimeLength,
                flyToDuration,
                transitionDelay,
                transitionDuration,
            }: Partial<StoryState>) => this.timelineService.recordState({
                zoom: this.leafletMap.getZoom(),
                latitude: this.leafletMap.getCenter().lat,
                longitude: this.leafletMap.getCenter().lng,
                stepTimeLength,
                flyToDuration,
                transitionDelay,
                transitionDuration,
            }),
            onRecordDeleteClick: (time: number) => this.timelineService.deleteState(time),
            timeGranularity: this.formState.realTimeEnabled ? this.formState.granularity : null,
        };
        const timelineComponent = new TimelineComponent(container, props);

        timelineComponent.onCurrentTimeIndexChange.subscribe(
            (currentTimeIndex: number) => this.timelineService.setCurrentTimeIndex(currentTimeIndex),
        );

        timelineComponent.onTimesChanged.subscribe(
            ({ currentTimeIndex, startTimeIndex, endTimeIndex }: OnTimesChangedParams) => {
                this.timelineService.setTimeState({
                    current: currentTimeIndex,
                    start: startTimeIndex,
                    end: endTimeIndex,
                });
            },
        );

        this.timelineService.onStoryChanged.subscribe((story) => {
            timelineComponent.story = story;
        });

        this.timelineService.onCurrentTimeIndexChanged.subscribe(({ currentTimeIndex }) => {
            timelineComponent.setCurrentTimeIndex(currentTimeIndex);
        });

        this.timelineService.onTimeStateChanged.subscribe((timeState) => {
            timelineComponent.timeState = timeState;
        });

        this.timelineService.onIsPlayingChanged.subscribe((isPlaying) => {
            timelineComponent.isPlaying = isPlaying;
        });

        return container;
    }
}

