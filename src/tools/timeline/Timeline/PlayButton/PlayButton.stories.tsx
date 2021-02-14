import React from 'react';
import { Story } from '@storybook/react/types-6-0';
import { PlayButton, PlayButtonProps } from './PlayButton';

export default {
    title: 'Timeline/PlayButton',
    argTypes: { onClick: { action: 'Play button clicked' } },
};

const Template: Story<PlayButtonProps> = (args) => <PlayButton {...args} />;

export const Default = Template.bind({});
Default.args = { isPlaying: true };
Default.parameters = {
    isPlaying: {
        values: [true, false],
    },
};

