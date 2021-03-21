import React, { FC, useCallback, useMemo } from "react";
import { Handles, Rail, Slider as SliderBase, Ticks, Tracks } from "react-compound-slider";
import { scaleLinear } from "d3-scale";
import { Track } from "./components/Track";
import { Tick } from "./components/Tick";
import { Handle } from "./components/Handle";
import { format } from "date-fns";
import "./Slider.scss";
import { TooltipRail } from "./components/TooltipRail";
import { Chart } from "../Chart/Chart";

const sliderStyle = {
    position: "relative",
    width: "100%",
    touchAction: "none",
};

export type SliderProps = {
    times: Date[],
    currentTime: number,
    startTimeIndex: number,
    endTimeIndex: number,
    startTimeOffset: number,
    formatTick?: (time: number) => string,
    onChange: (values: ReadonlyArray<number>) => void,
    chartData?: Array<{ name: string, values: Map<Date, number | undefined> }>,
}

const NUMBER_OF_TICKS = 5;

export const Slider: FC<SliderProps> = ({
    chartData: chartDataDefault,
    times: timesDefault,
    startTimeIndex,
    endTimeIndex,
    currentTime,
    onChange: onChangeProp,
    story,
    tickFormat,
}) => {
    const times = useMemo(() => timesDefault.slice(startTimeIndex, endTimeIndex + 1),
        [timesDefault, startTimeIndex, endTimeIndex]);
    const domain = useMemo(() => [0, times.length - 1], [times]);
    const values = useMemo(() => [currentTime - startTimeIndex], undefined); //, [currentTime, startTimeOffset]);
    const onUpdate = (values: ReadonlyArray<number>) => {
        onChangeProp(values.map(value => value + startTimeIndex));
    };
    const onChange = (values: ReadonlyArray<number>) => {
        onChangeProp(values.map(value => value + startTimeIndex));
    };

    const chartData = chartDataDefault?.reduce((acc, { name, values }) => (
        [...acc, {
            name,
            values: new Map([...values.entries()].filter(([time]) => times.map(t => +t).includes(+time))),
        }]
    ), []);
    const getChartValues = (time: Date) => chartData?.map(({ name, values }) => ({ name, value: values.get(time) }));
    const labels = times.map((time) => ({ time: format(time, tickFormat), values: getChartValues(time) }));
    const ticksIndexes = scaleLinear()
        .domain([domain[0], domain[1]])
        .ticks(NUMBER_OF_TICKS);
    const formatTick = useCallback((index) => ticksIndexes.includes(index) ? labels[index].time : null, [labels]);

    return (
        <div className={`react_time_range__time_range_container ${chartData ? "" : "compact"}`}>
            <SliderBase
                step={1}
                domain={domain}
                rootStyle={sliderStyle}
                onUpdate={onUpdate}
                onChange={onChange}
                values={values}
            >
                <Rail>
                    {({ getRailProps, activeHandleID, getEventData }) => <TooltipRail
                        labels={labels}
                        getRailProps={getRailProps}
                        activeHandleID={activeHandleID}
                        getEventData={getEventData}
                    />}
                </Rail>
                <Handles>
                    {({ handles: [valueHandle], getHandleProps, activeHandleID }) => (
                        <Handle
                            key={valueHandle.id}
                            handle={valueHandle}
                            tooltip={{
                                isActive: valueHandle.id === activeHandleID,
                                label: labels[valueHandle.value],
                            }}
                            domain={domain}
                            getHandleProps={getHandleProps}
                            type="inner"
                        />
                    )}
                </Handles>
                <Tracks right={false}>
                    {({ tracks, getTrackProps }) => (
                        <>
                            {tracks.map(({ id, source, target }) => (
                                <Track
                                    key={id}
                                    source={source}
                                    target={target}
                                    getTrackProps={getTrackProps}
                                />
                            ))}
                        </>
                    )}
                </Tracks>
                <Ticks values={Object.keys(labels).map(Number)}>
                    {({ ticks }) => (
                        <>
                            {ticks.map(tick => (
                                <Tick
                                    key={tick.id}
                                    tick={tick}
                                    format={formatTick}
                                    hasStory={story && story.has(times[tick.value])}
                                    count={0}
                                />
                            ))}
                        </>
                    )}
                </Ticks>
            </SliderBase>
            {chartData && <Chart data={chartData} />}
        </div>
    );
};
