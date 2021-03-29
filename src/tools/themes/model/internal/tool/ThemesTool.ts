import MapTool from "../../../../../model/internal/tool/MapTool";
import IThemesTool from "../../types/tool/IThemesTool";
import IThemesToolProps from "../../types/tool/IThemesToolProps";
import { ISidebarFragment, ISidebarFragmentControl } from "../../../../sidebar";
import IThemesToolDefaults from "../../types/tool/IThemesToolDefaults";
import ThemesToolDefaults from "./ThemesToolDefaults";
import IThemesToolState from "../../types/tool/IThemesToolState";
import ThemesToolState from "./ThemesToolState";
import IMapTheme from "../../types/theme/IMapTheme";
import ThemesToolEvent from "../event/ThemesToolEvent";
import ThemesToolSidebarFragment from "../sidebar/ThemesToolSidebarFragment";

/**
 * Attribute which is set to the map container.
 */
const THEME_ATTR_NAME = "data-theme";

/**
 * This class provides the themes tool.
 * 
 * @author Jiri Hynek
 */
class ThemesTool extends MapTool implements IThemesTool, ISidebarFragmentControl {
    
    /**
     * TODO: move to the tool state.
     */
    private sidebarFragment: ISidebarFragment | undefined;

    /**
     * It creates a new tool with respect to the props.
     * 
     * @param props 
     */
    public constructor(props: IThemesToolProps | undefined) {
        super(props);

        // the tab fragment for a sidebar tab will be created only if needed
        this.sidebarFragment = undefined;
    }

    /**
     * It creates a copy of the uninitialized tool.
     */
    public copy(): IThemesTool {
        return new ThemesTool(this.getProps());
    }

    /**
     * It returns the props given by the programmer.
     */
    public getProps(): IThemesToolProps {
        return <IThemesToolProps> super.getProps();
    }
    
    /**
     * It returns default values of the themes tool.
     */
    public getDefaults(): IThemesToolDefaults {
        return <IThemesToolDefaults> super.getDefaults();
    }

    /**
     * It creates new defaults of the tool.
     */
    protected createDefaults(): IThemesToolDefaults {
        return new ThemesToolDefaults(this);
    }

    /**
     * It returns the themes tool state.
     */
    public getState(): IThemesToolState {
        return <IThemesToolState> super.getState();
    }

    /**
     * It returns the tool state.
     */
    protected createState(): IThemesToolState {
        return new ThemesToolState(this);
    }

    /**
     * It creates new filter tool.
     */
    public create(): void {
        // set theme
        const theme = this.getState().getTheme();
        if(theme) {
            this.setTheme(theme);
        }
    }

    /**
     * It updates the theme and notifies listeners.
     * 
     * @param theme 
     */
    public setTheme(theme: IMapTheme): void {
        if(theme != undefined) {
            // if the theme tool is enabled, update map theme
            if(this.isEnabled()) {
                // update map container theme attribute (used by CSS selectors)
                const mapContainer = document.getElementById(this.getMap().getId());
                if(mapContainer) {
                    mapContainer.setAttribute(THEME_ATTR_NAME, theme.getName());
                }

                // update tool state
                this.getState().setTheme(theme);

                // dispatch event
                this.getMap().dispatchEvent(new ThemesToolEvent(this, theme));
            }
        }
    }

    /**
     * It returns tab control with respect to the configuration
     */
    public getSidebarFragment(): ISidebarFragment {
        if(this.sidebarFragment == undefined) {
            this.sidebarFragment = this.createSidebarTabFragment();
        }
        return this.sidebarFragment;
    }

    /**
     * It creates new tab fragment.
     */
    protected createSidebarTabFragment(): ISidebarFragment {
        // override if needed
        return new ThemesToolSidebarFragment(this, {
            // defined by the sidebar fragment defaults
            id: undefined,
            enabled: undefined
        });
    }
}
export default ThemesTool;