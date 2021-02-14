import { SliderItem } from 'react-compound-slider';
import React, { FC } from 'react';

interface TickProps {
    tick: SliderItem;
    count: number;
    format?: (val: number) => string | null;
}

export const Tick: FC<TickProps> = ({ tick, count, format = (d) => d }) => {
    const label = format(tick.value)

    const tickLabelStyle = {
        marginLeft: `${-(100 / count) / 2}%`,
        width: `${100 / count}%`,
        left: `${tick.percent}%`,
    };
    return (
        <div>
            <div
                className={`range_slider__tick_marker${label ? '__large' : ''}`}
                style={{ left: `${tick.percent}%` }}
            />
            {label && (
                <div className="range_slider__tick_label" style={tickLabelStyle}>
                    {label}
                </div>
            )}
        </div>
    );
};
