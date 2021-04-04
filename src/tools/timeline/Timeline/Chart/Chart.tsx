import React, { FC, useEffect, useRef, useState } from 'react';
import { drawChart } from './drawLineChart';
import { ChartData } from "../../TimelineComponent";

export type ChartProps = {
    data: ChartData
}

export const Chart: FC<ChartProps> = ({ data }) => {
    const [dimensions, setDimensions] = useState<{ height: number | null, width: number | null} | null>(null);

    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (wrapperRef.current) {
            const getElementContentWidth = (element: HTMLElement) => {
                const styles = window.getComputedStyle(element);
                const padding = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
                return element.clientWidth - padding;
            };

            const getElementContentHeight = (element: HTMLElement) => {
                const styles = window.getComputedStyle(element);
                const padding = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
                return element.clientHeight - padding;
            };

            const width = wrapperRef.current ? getElementContentWidth(wrapperRef.current) : null;
            const height = wrapperRef.current ? getElementContentHeight(wrapperRef.current) : null;

            setDimensions({ height, width });
        }
    }, [wrapperRef.current]);

    useEffect(() => {
        if (dimensions?.width && dimensions?.height) {
            while (wrapperRef?.current?.firstChild) {
                wrapperRef.current.removeChild(wrapperRef.current.lastChild as Node);
            }

            data.forEach(chart => {
                drawChart(wrapperRef.current, [...chart.values], dimensions.width, dimensions.height);
            });
        }
    }, [dimensions, data]);

    return (
        <div
            ref={wrapperRef}
            style={{
                zIndex: 2,
                position: 'relative',
                height: '100%',
                width: '100%',
            }}
        />
    );
};
