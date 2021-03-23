import React, { FC, useMemo } from "react";
import { Handles, Rail, Slider as SliderBase, Tracks } from "react-compound-slider";
import { Track } from "./components/Track";
import { Handle } from "./components/Handle";
import { TooltipRail } from "./components/TooltipRail";
import { format } from "date-fns";
import "./RangeSlider.scss";

const sliderStyle = {
    position: "relative",
    width: "100%",
    touchAction: "none",
};

export type SliderProps = {
    times: Date[],
    start?: number,
    end?: number,
    currentTime?: number,
    step?: number,
    formatTick?: (time: number) => string,
    onChange: (values: ReadonlyArray<number>) => void,
}

const NUMBER_OF_TICKS = 5;

export const RangeSlider: FC<SliderProps> = ({
    times,
    start = 0,
    end = (times.length - 1),
    onChange: onChangeProp,
    tickFormat,
}) => {
    const domain = useMemo(() => [0, times.length - 1], [times]);
    const values = useMemo(() => [start, end], [start, end]);

    const onChange = (newValues: ReadonlyArray<number>) => {
        onChangeProp(newValues);
    };
    const labels = times.map((date) => ({ time: format(date, tickFormat), values: [] }));

    return (
        <div className="range_slider__time_range_container compact">
            <SliderBase
                mode={3}
                step={1}
                domain={domain}
                rootStyle={sliderStyle}
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
                    {({ handles: [startHandle, endHandle], getHandleProps }) => (
                        <>
                            <Handle
                                key={startHandle.id}
                                handle={startHandle}
                                domain={domain}
                                label={labels[startHandle.value]}
                                getHandleProps={getHandleProps}
                            />
                            <Handle
                                key={endHandle.id}
                                handle={endHandle}
                                domain={domain}
                                label={labels[endHandle.value]}
                                getHandleProps={getHandleProps}
                            />
                        </>
                    )}
                </Handles>
                <Tracks left={false} right={false}>
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
            </SliderBase>
        </div>
    );
};
