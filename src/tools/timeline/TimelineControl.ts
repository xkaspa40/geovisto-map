import L, { ControlOptions } from "leaflet";
import { OnTimesChangedParams, TimelineComponent } from "./TimelineComponent";
import { TimelineService } from "./TimelineService";

import "./TimelineControl.scss";

export class TimelineControl extends L.Control {
    private readonly timelineService: TimelineService;
    private readonly leafletMap: any;

    private constructor(timelineService: TimelineService,
        leafletMap: any,
        options: ControlOptions = { position: "bottomleft" }) {
        super(options);
        this.timelineService = timelineService;
        this.leafletMap = leafletMap;
    }

    static create(timelineService: TimelineService, leafletMap: any, options?: ControlOptions): TimelineControl {
        return new TimelineControl(timelineService, leafletMap, options);
    }


    onAdd(): HTMLElement {
        const container = L.DomUtil.create("div", "leaflet-timeline");
        L.DomEvent.disableClickPropagation(container);

        const props = {
            ...this.timelineService.getState(),
            onPlayClick: this.timelineService.togglePlay.bind(this.timelineService),
            onRecordClick: () => this.timelineService.recordState({
                zoom: this.leafletMap.getZoom(),
                latitude: this.leafletMap.getCenter().lat,
                longitude: this.leafletMap.getCenter().lng,
            }),
            onRecordDeleteClick: (time) => this.timelineService.deleteState(time),
        };
        const timelineComponent = TimelineComponent.create(container, props);

        timelineComponent.onTimesChanged.subscribe(
            ({ currentTimeIndex, startTimeIndex, endTimeIndex }: OnTimesChangedParams) => {
                this.timelineService.setState({ currentTimeIndex, startTimeIndex, endTimeIndex });
            },
        );

        this.timelineService.onStoryChanged.subscribe((story) => {
            timelineComponent.story = story;
        });

        this.timelineService.onCurrentTimeIndexChanged.subscribe(({ currentTimeIndex }) => {
            timelineComponent.currentTimeIndex = currentTimeIndex;
        });

        this.timelineService.onStartTimeIndexChanged.subscribe((startTimeIndex) => {
            timelineComponent.startTimeIndex = startTimeIndex;
        });

        this.timelineService.onEndTimeIndexChanged.subscribe((endTimeIndex) => {
            timelineComponent.endTimeIndex = endTimeIndex;
        });

        this.timelineService.onIsPlayingChanged.subscribe((isPlaying) => {
            timelineComponent.isPlaying = isPlaying;
        });

        return container;
    }
}

