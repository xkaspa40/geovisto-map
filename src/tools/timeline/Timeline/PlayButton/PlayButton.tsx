import React, { FC, useRef } from 'react';
import { useEventListener } from '../useEventListener';

import './PlayButton.scss';

export type PlayButtonProps = {
    isPlaying: boolean,
    onClick: () => void,
    disabled: boolean
}

export const PlayButton: FC<PlayButtonProps> = ({ isPlaying, onClick, disabled }) => {
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEventListener(buttonRef, 'click', onClick);

    return (
        <button ref={buttonRef} className="play-button" disabled={disabled}>
            <i className={`fa ${isPlaying ? 'fa-pause' : 'fa-play'}`} />
        </button>
    );
};
