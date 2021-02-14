import React, { FC, useRef } from 'react';
import { useEventListener } from '../useEventListener';

import './PlayButton.scss';

export type PlayButtonProps = {
    isPlaying: boolean,
    onClick: () => void,
}

export const PlayButton: FC<PlayButtonProps> = ({ isPlaying, onClick }) => {
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEventListener(buttonRef, 'click', onClick);

    return (
        <button ref={buttonRef} className="play-button">
            <i className={`fa ${isPlaying ? 'fa-pause' : 'fa-play'}`} />
        </button>
    );
};
