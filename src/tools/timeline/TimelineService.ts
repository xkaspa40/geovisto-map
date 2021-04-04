import { Subject } from "./Subject";

const START_INDEX = 0;

type State = {
    currentTimeIndex: number;
    startTimeIndex: number;
    endTimeIndex: number;
};

export type TimeData = {
    values: Map<number, Record<string, unknown>[]>;
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

export type Story = Map<number, StoryState>

export class TimelineService {
    onCurrentTimeIndexChanged = new Subject<{ currentTimeIndex: number, state: StoryState | undefined }>();
    onStartTimeIndexChanged = new Subject<number>();
    onEndTimeIndexChanged = new Subject<number>();
    onIsPlayingChanged = new Subject<boolean>();
    onStoryChanged = new Subject<Story>();

    private readonly times: number[];
    private readonly data: TimeData;
    private readonly stepTimeLength: number;
    private readonly transitionTimeLength: number;
    private story?: Story;
    private _currentTimeIndex = START_INDEX;
    private _startTimeIndex = START_INDEX;
    private _endTimeIndex = START_INDEX;
    private _isPlaying = false;
    private timeout: NodeJS.Timeout | null = null;

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
                state: this.story?.get(this.times[currentTimeIndex]),
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

    constructor({
        stepTimeLength,
        transitionTimeLength = 0,
        times,
        data,
    }: { stepTimeLength: number, transitionTimeLength: number, times: number[], data: TimeData }) {
        this.times = times;
        this.stepTimeLength = stepTimeLength;
        this.transitionTimeLength = transitionTimeLength;
        this.endTimeIndex = times.length - 1;
        this.data = data;
    }

    private nextTick() {
        const tick = () => {
            if (this.currentTimeIndex < this._endTimeIndex) {
                this.currentTimeIndex += 1;
                this.nextTick.call(this);
            } else {
                this.isPlaying = false;
                this.clearTimeout();
            }
        };
        this.timeout = setTimeout(
            tick.bind(this),
            this.stepTimeLength + (this.story && this.story.has(this.times[this.currentTimeIndex]) ? this.transitionTimeLength : 0),
        );
    }

    private clearTimeout() {
        this.timeout && clearTimeout(this.timeout);
        this.timeout = null;
    }

    private play() {
        this.isPlaying = true;
        this.nextTick();
    }

    private pause() {
        this.isPlaying = false;
        this.clearTimeout();
    }

    togglePlay(): void {
        if (this._isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    setStory(story: Story): void {
        this.story = story;
        this.onStoryChanged.notify(this.story);
    }

    recordState(storyState: StoryState): void {
        if (this.story) {
            this.story.set(this.times[this._currentTimeIndex], storyState);
            this.onStoryChanged.notify(this.story);
        }
    }

    deleteState(time: number): void {
        if (this.story) {
            this.story.delete(time);
            this.onStoryChanged.notify(this.story);
        }
    }

    getState(): State & { times: number[], data: TimeData, isPlaying: boolean } {
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
