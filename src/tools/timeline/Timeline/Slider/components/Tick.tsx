import { SliderItem } from "react-compound-slider";
import React, { FC } from "react";

interface TickProps {
    tick: SliderItem;
    count: number;
    format?: (val: number) => string | null;
    hasStory: boolean;
}

export const Tick: FC<TickProps> = ({ tick, count, format = (d) => d, hasStory }) => {
    const label = format(tick.value);
    const tickLabelStyle = {
        marginLeft: `${-(100 / count) / 2}%`,
        width: `${100 / count}%`,
        left: `${tick.percent}%`,
    };
    return (
        <div>
            <div
                className={`react_time_range__tick_marker${label ? "__large" : ""}`}
                style={{ left: `${tick.percent}%` }}
            />
            {hasStory && <div
                className="react_time_range__story_marker"
                style={{ left: `${tick.percent}%` }}
            />}
            {label && (
                <div className="react_time_range__tick_label" style={tickLabelStyle}>
                    {label}
                </div>
            )}
        </div>
    );
};
