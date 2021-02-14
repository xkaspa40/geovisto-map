import { GetRailProps } from 'react-compound-slider';
import React, { FC, useRef } from 'react';


interface SliderRailProps {
    getRailProps: GetRailProps;
}

export const SliderRail: FC<SliderRailProps> = ({ getRailProps }) => {
    const sliderRef = useRef<HTMLDivElement>(null);

    // const {onMouseDown, onTouchStart} = getRailProps();
    // useEventListener(sliderRef, 'mousedown', onMouseDown);
    // useEventListener(sliderRef, 'touchstart', onTouchStart);

    return (
        <>
            <div ref={sliderRef} className="range_slider__rail__outer" />
            <div className="range_slider__rail__inner" />
        </>
    );
};
