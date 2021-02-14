import { Subject } from "./Subject";

const TIMEOUT = 3000;
const START_INDEX = 0;

type State = {
    currentTimeIndex: number;
    startTimeIndex: number;
    endTimeIndex: number;
};

export type TimeData = {
    values: Map<Date, Record<string, unknown>[]>;
    charts?: null | Array<{
        path: string;
        aggregationFn: "sum" | "average";
    }>
}

export type StoryState = {
    zoom: number,
    latitude: number,
    longitude: number,
}

export class TimelineService {
    onCurrentTimeIndexChanged = new Subject<{ currentTimeIndex: number, state: StoryState }>();
    onStartTimeIndexChanged = new Subject<number>();
    onEndTimeIndexChanged = new Subject<number>();
    onIsPlayingChanged = new Subject<boolean>();
    onStoryChanged = new Subject<Map<Date, StoryState | undefined>>();

    private readonly times: Date[];
    private readonly data: TimeData;
    private story: Map<Date, StoryState | undefined> = new Map();
    private _currentTimeIndex = START_INDEX;
    private _startTimeIndex = START_INDEX;
    private _endTimeIndex = START_INDEX;
    private _isPlaying = false;
    private interval: NodeJS.Timeout | null = null;

    private set isPlaying(value: boolean) {
        if (this._isPlaying !== value) {
            this._isPlaying = value;
            this.onIsPlayingChanged.notify(value);
        }
    }

    private get currentTimeIndex() {
        return this._currentTimeIndex;
    }

    private set currentTimeIndex(currentTimeIndex: number) {
        if (this._currentTimeIndex !== currentTimeIndex) {
            this._currentTimeIndex = currentTimeIndex;
            this.onCurrentTimeIndexChanged.notify({
                currentTimeIndex,
                state: this.story.get(this.times[currentTimeIndex]),
            });
        }
    }

    private set startTimeIndex(startTimeIndex: number) {
        if (this._startTimeIndex !== startTimeIndex) {
            this._startTimeIndex = startTimeIndex;
            this.onStartTimeIndexChanged.notify(startTimeIndex);
        }
    }

    private set endTimeIndex(endTimeIndex: number) {
        if (this._endTimeIndex !== endTimeIndex) {
            this._endTimeIndex = endTimeIndex;
            this.onEndTimeIndexChanged.notify(endTimeIndex);
        }
    }

    private constructor(times: Date[], data: TimeData) {
        this.times = times;
        this.endTimeIndex = times.length - 1;
        this.data = data;
    }

    static create(times: Date[], data: TimeData): TimelineService {
        return new TimelineService(times, data);
    }

    private tick() {
        if (this.currentTimeIndex < this._endTimeIndex) {
            this.currentTimeIndex += 1;
        } else {
            this.isPlaying = false;
            this.clearInterval();
        }
    }

    private clearInterval() {
        this.interval && clearInterval(this.interval);
        this.interval = null;
    }

    private play() {
        this.isPlaying = true;
        if (!this.interval) {
            this.interval = setInterval(() => this.tick(), TIMEOUT);
        }
    }

    private pause() {
        this.isPlaying = false;
        this.interval && clearInterval(this.interval);
        this.interval = null;
    }

    togglePlay(): void {
        if (this._isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    recordState({ zoom, latitude, longitude }: StoryState): void {
        this.story.set(this.times[this._currentTimeIndex], { zoom, latitude, longitude });
        this.onStoryChanged.notify(this.story);
    }

    deleteState(time: Date): void {
        this.story.delete(time);
        this.onStoryChanged.notify(this.story);
    }

    getState(): State & { times: Date[], data: TimeData, isPlaying: boolean } {
        return {
            times: this.times,
            data: this.data,
            currentTimeIndex: this.currentTimeIndex,
            startTimeIndex: this._startTimeIndex,
            endTimeIndex: this._endTimeIndex,
            isPlaying: this._isPlaying,
        };
    }

    setState({ startTimeIndex, endTimeIndex, currentTimeIndex }: State): void {
        this.currentTimeIndex = currentTimeIndex;
        this.startTimeIndex = startTimeIndex;
        this.endTimeIndex = endTimeIndex;
    }
}
