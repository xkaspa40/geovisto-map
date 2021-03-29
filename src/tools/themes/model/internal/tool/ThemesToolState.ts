import MapToolState from "../../../../../model/internal/tool/MapToolState";
import IThemesToolState from "../../types/tool/IThemesToolState";
import IThemesTool from "../../types/tool/IThemesTool";
import IThemesToolConfig from "../../types/tool/IThemesToolConfig";
import IThemesToolProps from "../../types/tool/IThemesToolProps";
import IThemesToolDefaults from "../../types/tool/IThemesToolDefaults";
import IMapThemesManager from "../../types/theme/IMapThemesManager";
import IMapTheme from "../../types/theme/IMapTheme";

/**
 * This class provide functions for using themes.
 * 
 * @author Jiri Hynek
 */
class ThemesToolState extends MapToolState implements IThemesToolState {
    
    private manager: IMapThemesManager;
    
    private theme: IMapTheme;

    /**
     * It creates a tool state.
     */
    public constructor(tool: IThemesTool) {
        super(tool);

        const props: IThemesToolProps = <IThemesToolProps> this.getProps();
        const defaults: IThemesToolDefaults = <IThemesToolDefaults> this.getDefaults();

        // set theme manager - needs to be set before the theme
        this.manager = props.manager == undefined ? defaults.getThemesManager() : props.manager;

        // set theme
        this.theme = props.theme == undefined ? defaults.getTheme() : props.theme;
    }

    /**
     * It resets state with respect to initial props.
     */
    public reset(): void {
        super.reset();

        const props: IThemesToolProps = <IThemesToolProps> this.getProps();
        const defaults: IThemesToolDefaults = <IThemesToolDefaults> this.getDefaults();

        // set theme manager - needs to be set before the theme
        this.setThemesManager(props.manager == undefined ? defaults.getThemesManager() : props.manager);

        // set theme
        this.setTheme(props.theme == undefined ? defaults.getTheme() : props.theme);
    }

    /**
     * The metod takes config and deserializes the values.
     * 
     * @param config 
     */
    public deserialize(config: IThemesToolConfig): void {
        super.deserialize(config);

        // deserialize theme id
        if(config.theme != undefined) {
            // get filter and data manegers which are need for proper deserialization of filter rules
            const themesManager = this.getThemesManager();
            if(themesManager != undefined) {
                const theme = themesManager.getDomain(config.theme);
                if(theme && theme.length > 0) {
                    this.setTheme(theme[0]);
                }
            }
        }
    }

    /**
     * The method serializes the tool state. Optionally, defaults can be set if property is undefined.
     * 
     * @param filterDefaults
     */
    public serialize(filterDefaults: boolean): IThemesToolConfig {
        const config: IThemesToolConfig = <IThemesToolConfig> super.serialize(filterDefaults);

        // serialize the theme
        const theme = this.getTheme();
        const defaultTheme: IMapTheme | undefined = (<IThemesToolDefaults> this.getDefaults()).getTheme();
        config.theme = filterDefaults && defaultTheme && theme.getName() == defaultTheme.getName() ? undefined : theme.getName();

        return config;
    }

    /**
     * It returns themes manager.
     */
    public getThemesManager(): IMapThemesManager {
        return this.manager;
    }

    /**
     * It sets themes manager.
     * 
     * @param manager 
     */
    public setThemesManager(manager: IMapThemesManager): void {
        this.manager = manager;
    }

    /**
     * It returns the theme property of the tool state.
     */
    public getTheme(): IMapTheme {
        return this.theme;
    }

    /**
     * It sets the theme property of the tool state.
     * 
     * @param theme 
     */
    public setTheme(theme: IMapTheme): void {
       this.theme = theme;
    }
}
export default ThemesToolState;