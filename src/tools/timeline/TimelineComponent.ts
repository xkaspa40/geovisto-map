import React from "react";
import ReactDOM from "react-dom";
import { Timeline } from "./Timeline";
import { Subject } from "./Subject";
import { Story, TimeData } from "./TimelineService";
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
    startTimeIndex: number;
    endTimeIndex: number;
    currentTimeIndex?: number;
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

    private readonly container: HTMLElement;
    private _times: number[];
    private _story?: Story;
    private _currentTimeIndex: number;
    private _startTimeIndex: number;
    private _endTimeIndex: number;
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

    set currentTimeIndex(value: number) {
        this._currentTimeIndex = value;
        this.render();
    }

    set startTimeIndex(value: number) {
        this._startTimeIndex = value;
        this.render();
    }

    set endTimeIndex(value: number) {
        this._endTimeIndex = value;
        this.render();
    }

    set isPlaying(value: boolean) {
        this._isPlaying = value;
        this.render();
    }

    constructor(container: HTMLElement, props: TimelineProps) {
        this.container = container;
        this._times = [...props.data.values.keys()];
        this._startTimeIndex = props.startTimeIndex;
        this._endTimeIndex = props.endTimeIndex;
        this._currentTimeIndex = props.currentTimeIndex ?? this._startTimeIndex;
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
                    startTimeIndex: this._startTimeIndex,
                    endTimeIndex: this._endTimeIndex,
                    currentTime: this._currentTimeIndex,
                    onCurrentTimeIndexChange: this.onCurrentTimeIndexChange,
                    onRangeTimesIndexChange: this.onRangeTimesIndexChange,
                    isPlaying: this._isPlaying,
                    onPlayClick: this._onPlayClick,
                    chartData: this.chartData,
                    onRecordClick: this._onRecordClick,
                    onRecordDeleteClick: () => this._onRecordDeleteClick(this._times[this._currentTimeIndex]),
                    story: this._story,
                    tickFormat: this.tickFormat,
                },
            ),
            this.container,
        );
    }

    private onCurrentTimeIndexChange = (currentTimeIndex: number) => {
        this._currentTimeIndex = currentTimeIndex;
        this.onTimesChanged.notify({
            currentTimeIndex,
            startTimeIndex: this._startTimeIndex,
            endTimeIndex: this._endTimeIndex,
        });
    };

    private onRangeTimesIndexChange = ([startTimeIndex, endTimeIndex]: [number, number]) => {
        if (this._startTimeIndex === startTimeIndex && this._endTimeIndex === endTimeIndex) return;

        let currentTimeIndex = this._currentTimeIndex;
        if (this._currentTimeIndex < startTimeIndex) {
            currentTimeIndex = 0;
        } else if (this._currentTimeIndex > endTimeIndex) {
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
}
