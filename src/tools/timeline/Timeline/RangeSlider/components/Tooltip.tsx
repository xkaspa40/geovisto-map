import React, { FC } from 'react';

type TooltipProps = {
    percent: number;
    label: { time: string, values: Array<{ name: string, value: number }> };
}

export const Tooltip: FC<TooltipProps> = ({ percent, label }) => {
    return (
        <div
            style={{
                left: `${percent}%`,
                position: 'absolute',
                marginLeft: '-11px',
                marginTop: '-20px',
            }}
        >
            <div className="tooltip">
                <div className="tooltiptext">
                    {label.time}
                    {label.values?.map(value => (
                        <div key={value.name}>{`${value.name}: ${value.value ?? '-'}`}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};

