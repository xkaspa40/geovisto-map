import { Subject } from "./Subject";

const START_INDEX = 0;

export type TimeState = {
    current: number;
    start: number;
    end: number;
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
    onTimeStateChanged = new Subject<TimeState>();
    onIsPlayingChanged = new Subject<boolean>();
    onStoryChanged = new Subject<Story>();

    private readonly times: number[];
    private readonly data: TimeData;
    private readonly stepTimeLength: number;
    private readonly transitionTimeLength: number;
    private story?: Story;
    private timeState: TimeState = {
        current: START_INDEX,
        start: START_INDEX,
        end: START_INDEX,
    };
    private _isPlaying = false;
    private timeout: NodeJS.Timeout | null = null;

    private set isPlaying(value: boolean) {
        if (this._isPlaying !== value) {
            this._isPlaying = value;
            this.onIsPlayingChanged.notify(value);
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
        this.timeState.end = times.length - 1;
        this.data = data;
    }

    setCurrentTimeIndex(currentTimeIndex: number): void {
        if (this.timeState.current !== currentTimeIndex) {
            this.timeState.current = currentTimeIndex;
            this.onCurrentTimeIndexChanged.notify({
                currentTimeIndex,
                state: this.story?.get(this.times[currentTimeIndex]),
            });
        }
    }

    private nextTick() {
        const tick = () => {
            if (this.timeState.current < this.timeState.end) {
                this.setCurrentTimeIndex(this.timeState.current + 1);
                this.nextTick.call(this);
            } else {
                this.isPlaying = false;
                this.clearTimeout();
            }
        };
        this.timeout = setTimeout(
            tick.bind(this),
            this.stepTimeLength + (this.story && this.story.has(this.times[this.timeState.current]) ? this.transitionTimeLength : 0),
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
            this.story.set(this.times[this.timeState.current], storyState);
            this.onStoryChanged.notify(this.story);
        }
    }

    deleteState(time: number): void {
        if (this.story) {
            this.story.delete(time);
            this.onStoryChanged.notify(this.story);
        }
    }

    getState(): { times: number[], data: TimeData, isPlaying: boolean, timeState: TimeState } {
        return {
            times: this.times,
            data: this.data,
            timeState: this.timeState,
            isPlaying: this._isPlaying,
        };
    }

    setTimeState(timeState: TimeState): void {
        const hasCurrentTimeIndexChanged = this.timeState.current !== timeState.current;
        this.timeState = timeState;
        this.onTimeStateChanged.notify(timeState);

        if (hasCurrentTimeIndexChanged) {
            this.onCurrentTimeIndexChanged.notify({
                currentTimeIndex: timeState.current,
                state: this.story?.get(this.times[timeState.current]),
            });
        }
    }
}
