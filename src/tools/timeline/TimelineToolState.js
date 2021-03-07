import { AbstractLayerToolState } from "../layers/abstract";

/**
 * This class provide functions for using the state of the layer tool.
 *
 * @author Jiri Hynek
 */
class TimelineToolState extends AbstractLayerToolState {

    /**
     * It creates a tool state.
     */
    constructor() {
        super();
    }

    /**
     * It resets state with respect to initial props. Optionally, defaults can be set if property
     * is undefined.
     *
     * @param {TimelineToolDefaults} defaults
     */
    reset(defaults) {
        super.reset(defaults);

        // the layer tool properties
        // this.setZIndex(defaults ? defaults.getZIndex() : 350);
        // TODO
    }

    /**
     * Help function which resets the state properties realated with map if not defined.
     */
    resetMapVariables(map, defaults) {
        super.resetMapVariables(map, defaults);

        // let props = this.getProps();
        // this.setPolygons(props.polygons == undefined && defaults && map ? defaults.getPolygons()
        // : props.polygons);
    }

    /**
     * The metod takes config and desrializes the values.
     *
     * @param {*} config
     */
    deserialize(config) {
        super.deserialize(config);
        // the layer tool config
        if (config.stories) {
            this.stories = config.stories.map(story => ({
                ...story,
                config: story.config.map(storyConfig => ({
                    ...storyConfig,
                    time: new Date(storyConfig.time).getTime(),
                }))
            }));
        }
    }

    /**
     * The method serializes the tool state. Optionally, defaults can be set if property is
     * undefined.
     *
     * @param {TimelineToolDefaults} defaults
     */
    serialize(defaults) {
        const config = {
            ...super.serialize(defaults),
            // TODO serialize form data
            stories: this.stories.map(story => ({
                ...story,
                config: story.config.map(storyConfig => ({
                    ...storyConfig,
                    time: new Date(storyConfig.time).toISOString(),
                }))
            }))
        }
        return config;
    }

    getStories() {
        return this.stories;
    }

    setStories(stories) {
        this.stories = stories;
    }

    saveStory(story) {
        this.setStories([
            ...this.getStories().filter(({ name }) => name !== story.name),
            story
        ])
    }

    getStoryByName(name) {
        if (!this.stories || this.stories.length === 0) return null;

        return this.stories.find(({ name: storyName }) => storyName === name);
    }

    createStory(name) {
        this.saveStory({ name, config: [] })
    }
}

export default TimelineToolState;
