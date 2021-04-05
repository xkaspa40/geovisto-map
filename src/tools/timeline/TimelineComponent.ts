import React from "react";
import ReactDOM from "react-dom";
import { Timeline } from "./Timeline";
import { Subject } from "./Subject";
import { Story, TimeData, TimeState } from "./TimelineService";
import { path as getFromPath } from "./utils";
import { TimeGranularity } from "./contants";

export type OnTimesChangedParams = {
    currentTimeIndex: number,
    startTimeIndex: number,
    endTimeIndex: number,
}

export type ChartData = Array<{ name: string, values: Map<number, number | undefined> }>

export type TimelineProps = {
    data: TimeData;
    timeState: TimeState;
    onPlayClick: () => void;
    onRecordClick: () => void;
    onRecordDeleteClick: (time: number) => void;
    timeGranularity: string;
}

const TickFormat = {
    [TimeGranularity.HOUR]: "hh:mm dd/MM/yyyy",
    [TimeGranularity.DAY]: "dd/MM/yyyy",
    [TimeGranularity.WEEK]: "dd/MM/yyyy",
    [TimeGranularity.MONTH]: "MM/yyyy",
    [TimeGranularity.YEAR]: "yyyy",
};

export class TimelineComponent {
    onTimesChanged = new Subject<OnTimesChangedParams>();
    onCurrentTimeIndexChange = new Subject<number>();

    private readonly container: HTMLElement;
    private _times: number[];
    private _story?: Story;
    private _timeState: TimeState;
    private _isPlaying = false;
    private readonly tickFormat: string = "hh:mm dd/MM/yyyy";
    private readonly _onPlayClick: () => void;
    private readonly _onRecordClick: () => void;
    private readonly _onRecordDeleteClick: (time: number) => void;
    private readonly chartData?: ChartData;

    set story(value: any) {
        this._story = value;
        this.render();
    }

    set times(value: number[]) {
        this._times = value;
        this.render();
    }

    set isPlaying(value: boolean) {
        this._isPlaying = value;
        this.render();
    }

    set timeState(timeState: TimeState) {
        this._timeState = timeState;
        this.render();
    }

    constructor(container: HTMLElement, props: TimelineProps) {
        this.container = container;
        this._times = [...props.data.values.keys()];
        this._timeState = props.timeState;
        this._onPlayClick = props.onPlayClick;
        this._onRecordClick = props.onRecordClick;
        this._onRecordDeleteClick = props.onRecordDeleteClick;
        this.tickFormat = props.timeGranularity ? TickFormat[props.timeGranularity] : "hh:mm dd/MM/yyyy";
        if (props.data.charts) {
            this.chartData = this.createChartData(props.data);
        }
        this.render();
    }

    destroy(): void {
        ReactDOM.unmountComponentAtNode(this.container);
    }

    private render(): void {
        ReactDOM.render(
            React.createElement(
                Timeline,
                {
                    times: this._times,
                    startTimeIndex: this._timeState.start,
                    endTimeIndex: this._timeState.end,
                    currentTime: this._timeState.current,
                    onCurrentTimeIndexChange: this.handleCurrentTimeIndexChange.bind(this),
                    onRangeTimesIndexChange: this.handleRangeTimesIndexChange.bind(this),
                    isPlaying: this._isPlaying,
                    onPlayClick: this._onPlayClick,
                    chartData: this.chartData,
                    onRecordClick: this._onRecordClick,
                    onRecordDeleteClick: () => this._onRecordDeleteClick(this._times[this._timeState.current]),
                    story: this._story,
                    tickFormat: this.tickFormat,
                },
            ),
            this.container,
        );
    }

    private handleCurrentTimeIndexChange = (currentTimeIndex: number) => {
        this.onCurrentTimeIndexChange.notify(currentTimeIndex);
    };

    private handleRangeTimesIndexChange = ([startTimeIndex, endTimeIndex]: [number, number]) => {
        if (this._timeState.start === startTimeIndex && this._timeState.end === endTimeIndex) return;

        let currentTimeIndex = this._timeState.current;
        if (this._timeState.current < startTimeIndex) {
            currentTimeIndex = 0;
        } else if (this._timeState.current > endTimeIndex) {
            currentTimeIndex = endTimeIndex;
        }

        this.onTimesChanged.notify({
            currentTimeIndex: currentTimeIndex,
            startTimeIndex: startTimeIndex,
            endTimeIndex: endTimeIndex,
        });
    };

    private createChartData({ values, charts }: TimeData) {
        return charts?.map(({ path, aggregationFn }) => (
            this._times.reduce((acc, time) => {
                    const timeChartValue = this.getChartValue(path, values.get(time), aggregationFn);
                    acc.values.set(time, timeChartValue);
                    return acc;
                },
                { name: path, values: new Map() },
            )
        ));
    }

    private getChartValue(path: string,
        values: Record<string, unknown>[] | undefined,
        aggregationFn: "average" | "sum") {
        if (!values) return null;

        const chartValue = values.reduce((acc, value) => acc + getFromPath(path, value), 0);
        if (aggregationFn === "average") {
            return chartValue / values.length;
        }
        return chartValue;
    }

    setCurrentTimeIndex(currentTimeIndex: number): void {
        this._timeState.current = currentTimeIndex;
        this.render();
    }
}
