import React, { FC, useState } from "react";
import { Slider } from "./Slider";
import { PlayButton } from "./PlayButton";
import { RangeSlider } from "./RangeSlider/RangeSlider";

import "./Timeline.scss";
import { Story, StoryState } from "../TimelineService";
import { ChartData } from "../TimelineComponent";
import { StoryConfigurator } from "./StoryConfigurator";

export type TimelineProps = {
    times: number[],
    start?: number,
    end?: number,
    currentTimeIndex: number,
    startTimeIndex: number,
    endTimeIndex: number,
    step?: number,
    formatTick?: (time: number) => string,
    onCurrentTimeIndexChange: (currentTimeIndex: number) => void,
    onRangeTimesIndexChange: ([startTimeIndex, endTimeIndex]: [number, number]) => void,
    isPlaying: boolean,
    onPlayClick: () => void,
    data?: number[],
    chartData?: ChartData,
    onRecordClick: ({
        stepTimeLength,
        flyToDuration,
        transitionDelay,
        transitionDuration,
    }: Partial<StoryState>) => void;
    onRecordDeleteClick: () => void;
    tickFormat: string;
    story?: Story;
}

export const Timeline: FC<TimelineProps> = ({
    chartData,
    isPlaying,
    onPlayClick,
    times,
    currentTimeIndex,
    startTimeIndex,
    endTimeIndex,
    onCurrentTimeIndexChange,
    onRangeTimesIndexChange,
    onRecordClick,
    onRecordDeleteClick,
    story,
    tickFormat,
}) => {
    const [compact, setCompact] = useState(true);
    const hasOnlyOneTimestamp = times.length === 1;

    return (
        <>
            {!hasOnlyOneTimestamp && <div className="timeline__collapse_button_wrapper">
                <button className="timeline__collapse_button" onClick={() => setCompact(c => !c)}>
                    <i className={`fa fa-angle-${compact ? "up" : "down"}`} />
                </button>
            </div>}
            <div className={`timeline ${chartData ? "with-chart" : ""}`}>
                {!compact && (
                    <div className="timeline__range_slider_wrapper">
                        {story && <StoryConfigurator
                            storyState={story?.get(times[currentTimeIndex])}
                            onRecordClick={onRecordClick}
                            onRecordDeleteClick={onRecordDeleteClick}
                        />}
                        <RangeSlider
                            times={times}
                            onChange={onRangeTimesIndexChange}
                            tickFormat={tickFormat}
                        />
                    </div>
                )}
                <div className="timeline__player_container">
                    <div className="timeline__control_button__wrapper">
                        <PlayButton
                            isPlaying={isPlaying}
                            onClick={onPlayClick}
                            disabled={hasOnlyOneTimestamp}
                        />
                    </div>
                    <div className="timeline__slider__wrapper">
                        <Slider
                            times={times}
                            currentTimeIndex={currentTimeIndex}
                            startTimeIndex={startTimeIndex}
                            endTimeIndex={endTimeIndex}
                            onChange={onCurrentTimeIndexChange}
                            chartData={chartData}
                            story={story}
                            tickFormat={tickFormat}
                            disabled={hasOnlyOneTimestamp}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};
