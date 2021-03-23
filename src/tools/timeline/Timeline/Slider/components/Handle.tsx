import { GetHandleProps, SliderItem } from "react-compound-slider";
import React, { FC, useCallback, useRef, useState } from "react";
import { useEventListener } from "../../useEventListener";
import { Tooltip } from "./Tooltip";

export interface HandleProps {
    domain: number[];
    handle: SliderItem;
    getHandleProps: GetHandleProps;
    disabled?: boolean;
    type: "left" | "right" | "inner";
    labelText?: string;
    tooltip?: {
        isActive: boolean,
        text: string,
    }
}

const getText = ({ time, values }) => `${time} \n`;

export const Handle: FC<HandleProps> = ({
    domain: [min, max],
    handle: { id, value, percent },
    disabled = false,
    getHandleProps,
    type,
    tooltip,
}) => {
    const handleRef = useRef<HTMLDivElement>(null);
    const { onKeyDown, onMouseDown, onTouchStart } = getHandleProps(id);

    const [mouseOver, setMouseOver] = useState(false);

    const onMouseEnter = useCallback(() => setMouseOver(true), []);
    const onMouseLeave = useCallback(() => setMouseOver(false), []);

    useEventListener(handleRef, "mouseenter", onMouseEnter);
    useEventListener(handleRef, "mouseleave", onMouseLeave);

    useEventListener(handleRef, "mousedown", onMouseDown, disabled);
    useEventListener(handleRef, "keydown", onKeyDown, disabled);
    useEventListener(handleRef, "touchstart", onTouchStart, disabled);

    const style = (function () {
        if (type === "left") {
            return { left: `calc(${percent}% - 12px)` };
        }
        if (type === "right") {
            return { left: `calc(${percent}% + 12px)` };
        }
        if (type === "inner") {
            return { left: `${percent}%` };
        }
    })();

    return (
        <>
            {tooltip && (mouseOver || tooltip.isActive) && !disabled && (
                <Tooltip percent={percent} label={tooltip.label} />
            )}
            <div
                ref={handleRef}
                className="react_time_range__handle_wrapper"
                style={style}
            />
            <div
                role="slider"
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={value}
                className={`react_time_range__handle_container${disabled ? "__disabled" : ""}`}
                style={style}
            >
                {type === "inner" && <div className={`react_time_range__handle_tick`} />}
                {type !== "inner" && (
                    <div className={`react_time_range__handle_marker_container ${type}`}>
                        <div className={`react_time_range__handle_marker`} />
                    </div>
                )}
            </div>
        </>
    );
};
