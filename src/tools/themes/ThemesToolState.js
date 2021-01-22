import AbstractToolState from "../../model/tool/abstract/AbstractToolState";
import AbstractTheme from "./model/theme/abstract/AbstractTheme";
import ThemesToolDefaults from "./ThemesToolDefaults";

/**
 * This class provide functions for using themes.
 * 
 * @author Jiri Hynek
 */
class ThemesToolState extends AbstractToolState {

    /**
     * It creates a tool state.
     */
    constructor() {
        super();
    }

    /**
     * It resets state with respect to initial props. Optionally, defaults can be set if property is undefined.
     * 
     * @param {ThemesToolDefaults} defaults 
     */
    reset(defaults) {
        super.reset(defaults);

        let props = this.getProps();

        // set theme manager - needs to be set before the theme
        this.setThemesManager(props.manager == undefined && defaults ? defaults.getThemesManager() : props.manager);

        // set theme
        this.setTheme(props.theme == undefined && defaults ? defaults.getTheme() : props.theme);
    }

    /**
     * The metod takes config and desrializes the values.
     * 
     * @param {*} config 
     */
    deserialize(config) {
        super.deserialize(config);

        // deserialize theme id
        if(config.theme != undefined) {
            // get filter and data manegers which are need for proper deserialization of filter rules
            let themesManager = this.getThemesManager();
            if(themesManager != undefined) {
                let theme = themesManager.getTheme(config.theme);
                if(theme && theme.length > 0) {
                    this.setTheme(theme[0]);
                }
            }
        }
    }

    /**
     * The method serializes the tool state. Optionally, defaults can be set if property is undefined.
     * 
     * @param {ThemesToolDefaults} defaults
     */
    serialize(defaults) {
        let config = super.serialize(defaults);

        // serialize the theme
        config.theme = defaults && this.getTheme() == undefined ? undefined : this.getTheme().getType();

        return config;
    }

    /**
     * It returns themes manager.
     */
    getThemesManager() {
        return this.manager;
    }

    /**
     * It sets themes manager.
     * 
     * @param {AbstractThemesManager} manager 
     */
    setThemesManager(manager) {
        this.manager = manager;
    }

    /**
     * It returns the theme property of the tool state.
     */
    getTheme() {
        return this.theme;
    }

    /**
     * It sets the theme property of the tool state.
     * 
     * @param {AbstractTheme} theme 
     */
    setTheme(theme) {
       this.theme = theme;
    }
}
export default ThemesToolState;