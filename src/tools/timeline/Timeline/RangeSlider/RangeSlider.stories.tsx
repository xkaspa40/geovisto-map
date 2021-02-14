import React, { useState } from 'react';
import { RangeSlider } from './RangeSlider';
import { Story } from '@storybook/react/types-6-0';
import { eachHourOfInterval, endOfTomorrow, startOfToday } from 'date-fns';

export default {
    title: 'Timeline/RangeSlider',
};

const SliderComponent = (props) => {
    const [value, setValue] = useState<ReadonlyArray<number>>([0]);
    return (
        <div style={{ width: '90%', margin: '50px 35px 0' }}>
            <RangeSlider
                currentTime={value[0]}
                onChange={setValue}
                {...props}
            />
        </div>
    );
};

const Template: Story = (args) => <SliderComponent {...args} />;

const times = eachHourOfInterval({ start: startOfToday(), end: endOfTomorrow() });

export const Default = Template.bind({});
Default.args = { times, start: 0, end: times.length - 1 };


// export const WithMultipleLineCharts = Template.bind({});
// const multipleChartData = [
//     { name: 'value1', values: new Map(times.map((d, i) => [d, i % 10 || i === 0 ? i : undefined])) },
//     { name: 'value2', values: new Map(times.map((d, i) => [d, i % 5 || i === 0 ? i * 3 : undefined])) },
//     { name: 'value3', values: new Map(times.map((d, i) => [d, i % 30 || i  === 0 ? i * 5 : undefined])) },
// ];
// WithMultipleLineCharts.args = { times, chartData: multipleChartData };
