import React, { FC, useState } from 'react';
import { Slider } from './Slider';
import { PlayButton } from './PlayButton';
import { RangeSlider } from './RangeSlider/RangeSlider';

import './Timeline.scss';

export type TimelineProps = {
    times: Date[],
    start?: number,
    end?: number,
    currentTime: number,
    startTimeIndex: number,
    endTimeIndex: number,
    step?: number,
    formatTick?: (time: number) => string,
    onCurrentTimeIndexChange: ([currentTimeIndex]: ReadonlyArray<number>) => void,
    onRangeTimesIndexChange: ([startTimeIndex, endTimeIndex]: ReadonlyArray<number>) => void,
    isPlaying: boolean,
    onPlayClick: () => void,
    data?: number[],
    chartData: Array<any>,
}

export const Timeline: FC<TimelineProps> = ({
    chartData,
    isPlaying,
    onPlayClick,
    times,
    currentTime,
    startTimeIndex,
    endTimeIndex,
    onCurrentTimeIndexChange,
    onRangeTimesIndexChange,
    onRecordClick,
    onRecordDeleteClick,
    story,
}) => {
    const [compact, setCompact] = useState(true);
    return (
        <>
            <div className="timeline__collapse_button_wrapper">
                <button className="timeline__collapse_button" onClick={() => setCompact(c => !c)}>
                    <i className={`fa fa-angle-${compact ? 'up' : 'down'}`} />
                </button>
            </div>
            <div className={`timeline ${chartData ? 'with-chart' : ''}`}>
                {!compact && <div className="timeline__range_slider_wrapper">
                    <RangeSlider times={times} onChange={onRangeTimesIndexChange} />
                </div>}
                <div className="timeline__player_container">
                    <div className="timeline__control_button__wrapper">
                        <PlayButton isPlaying={isPlaying} onClick={onPlayClick} />
                    </div>
                    <div className="timeline__slider__wrapper">
                        <Slider
                            times={times}
                            currentTime={currentTime}
                            startTimeIndex={startTimeIndex}
                            endTimeIndex={endTimeIndex}
                            onChange={onCurrentTimeIndexChange}
                            chartData={chartData}
                            onCurrentTimeIndexChange={onCurrentTimeIndexChange}
                            story={story}
                        />
                        <button onClick={onRecordClick}><i className="fa fa-save"/></button>
                        <button onClick={onRecordDeleteClick}><i className="fa fa-trash"/></button>
                    </div>
                </div>
            </div>
        </>
    );
};
