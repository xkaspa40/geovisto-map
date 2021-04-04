import React, { FC } from 'react';

type TooltipProps = {
    percent: number;
    label: string;
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
                    {label}
                </div>
            </div>
        </div>
    );
};

