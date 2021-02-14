import React from 'react';
import { Story } from '@storybook/react/types-6-0';
import { Chart, ChartProps } from './Chart';

export default {
    title: 'Timeline/Chart',
};

const Template: Story<ChartProps> = (args) => <Chart {...args} />;

export const Default = Template.bind({});
Default.args = {};
Default.parameters = {};
