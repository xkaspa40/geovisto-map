import React, { FC, SyntheticEvent, useEffect, useState } from "react";
import { StoryState } from "../../TimelineService";
import "./StoryConfigurator.scss";

type StoryConfiguratorProps = {
    onRecordClick: ({
        stepTimeLength,
        flyToDuration,
        transitionDelay,
        transitionDuration,
    }: Partial<StoryState>) => void;
    onRecordDeleteClick: () => void;
    storyState?: StoryState
}

export const StoryConfigurator: FC<StoryConfiguratorProps> = ({
    onRecordClick,
    onRecordDeleteClick,
    storyState = {},
}) => {
    const {
        stepTimeLength,
        flyToDuration,
        transitionDelay,
        transitionDuration,
    } = storyState;

    const [formState, setFormState] = useState<{ [key: string]: number | undefined }>({
        stepTimeLength,
        flyToDuration,
        transitionDelay,
        transitionDuration,
    });

    useEffect(() => {
        setFormState({ stepTimeLength, flyToDuration, transitionDelay, transitionDuration });
    }, [stepTimeLength, flyToDuration, transitionDelay, transitionDuration]);

    const handleChange = (e: SyntheticEvent<HTMLInputElement>) => {
        const { name, value } = e.target as HTMLInputElement;
        setFormState((f) => ({ ...f, [name]: value === "" ? undefined : (Number(value) < 0 ? 0 : Number(value)) }));
    };

    const handleSaveClick = () => onRecordClick(formState);

    const handleKeyDown = (e) => {
        if (!((e.keyCode > 95 && e.keyCode < 106)
            || (e.keyCode > 47 && e.keyCode < 58)
            || e.keyCode == 8)) {
            return false;
        }
    };

    const getInputProps = (name: string) => {
        const value = formState[name];
        return ({
            type: "number",
            name: name,
            value: value != null ? value.toString() : "",
            onChange: handleChange,
            onKeyDown: handleKeyDown,
            min: 0,
        });
    };

    return (
        <div className="geovisto-timeline-story-configurator">
            <u>Story</u>
            <div className="geovisto-timeline-story-configurator__inputs-wrapper">
                <div className="geovisto-timeline-story-configurator__input">
                    <label htmlFor="stepTimeLength">Step time (ms):</label>
                    <input {...getInputProps("stepTimeLength")} />
                </div>
                <div className="geovisto-timeline-story-configurator__input">
                    <label htmlFor="flyToDuration">Fly to duration (ms):</label>
                    <input {...getInputProps("flyToDuration")} />
                </div>
                <div className="geovisto-timeline-story-configurator__input">
                    <label htmlFor="transitionDelay">Transition delay (ms):</label>
                    <input {...getInputProps("transitionDelay")} />
                </div>
                <div className="geovisto-timeline-story-configurator__input">
                    <label htmlFor="transitionDuration">Transition duration (ms):</label>
                    <input {...getInputProps("transitionDuration")} />
                </div>
            </div>
            <button className="geovisto-timeline-story-configurator__button" onClick={handleSaveClick}>
                <i className="fa fa-save" />
            </button>
            <button className="geovisto-timeline-story-configurator__button" onClick={onRecordDeleteClick}>
                <i className="fa fa-trash" />
            </button>
        </div>
    );
};
