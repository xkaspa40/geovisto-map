import { GetHandleProps, SliderItem } from 'react-compound-slider';
import React, { FC, useCallback, useRef, useState } from 'react';
import { useEventListener } from '../../useEventListener';
import { Tooltip } from './Tooltip';

export interface HandleProps {
    domain: number[];
    handle: SliderItem;
    getHandleProps: GetHandleProps;
    label: string;
}

export const Handle: FC<HandleProps> = ({
    domain: [min, max],
    handle: { id, value, percent },
    label,
    getHandleProps,
}) => {
    const handleRef = useRef<HTMLDivElement>(null);
    const { onKeyDown, onMouseDown, onTouchStart } = getHandleProps(id);

    const [mouseOver, setMouseOver] = useState(false);

    const onMouseEnter = useCallback(() => setMouseOver(true), []);
    const onMouseLeave = useCallback(() => setMouseOver(false), []);

    useEventListener(handleRef, 'mouseenter', onMouseEnter);
    useEventListener(handleRef, 'mouseleave', onMouseLeave);

    useEventListener(handleRef, 'mousedown', onMouseDown);
    useEventListener(handleRef, 'keydown', onKeyDown);
    useEventListener(handleRef, 'touchstart', onTouchStart);

    return (
        <>
            {mouseOver && (
                <Tooltip percent={percent} label={label} />
            )}
            <div
                ref={handleRef}
                className="range_slider__handle_wrapper"
                style={{ left: `${percent}%` }}
            />
            <div
                role="slider"
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={value}
                className="range_slider__handle_container"
                style={{ left: `${percent}%` }}
            />
        </>
    );
};
