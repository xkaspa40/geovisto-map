import React, { useState } from 'react';
import { Story } from '@storybook/react/types-6-0';
import { eachHourOfInterval, endOfTomorrow, startOfToday } from 'date-fns';
import { Timeline } from './Timeline';

export default {
    title: 'Timeline/Timeline',
};

const times = eachHourOfInterval({ start: startOfToday(), end: endOfTomorrow() });

const data = times.map(d => d.getTime());

const TimelineComponent = () => {
    const [values, setValues] = useState<ReadonlyArray<number>>([0]);
    return (
        <Timeline
            times={times}
            currentTime={values[1]}
            onChange={setValues}
            chartData={data}
        />
    );
};

export const Default: Story = () => <TimelineComponent />;
