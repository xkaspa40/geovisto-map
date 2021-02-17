import AbstractTool from "../../model/tool/abstract/AbstractTool";
import ThemesToolState from "./ThemesToolState";
import ThemesToolEvent from "./model/event/ThemesToolEvent";
import ThemesToolDefaults from "./ThemesToolDefaults";
import ThemesToolTabFragment from "./sidebar/ThemesToolTabFragment";

/**
 * Attribute which is set to the map container.
 */
const THEME_ATTR_NAME = "data-theme";

/**
 * This class provides the themes tool.
 * 
 * @author Jiri Hynek
 */
class ThemesTool extends AbstractTool {

    /**
     * It creates a new tool with respect to the props.
     * 
     * @param {*} props 
     */
    constructor(props) {
        super(props);

        // the tab fragment for a sidebar tab will be created only if needed
        this.tabFragment = undefined
    }

    /**
     * A unique string of the tool type.
     */
    static TYPE() {
        return "geovisto-tool-themes";
    }

    /**
     * It creates a copy of the uninitialized tool.
     */
    copy() {
        return new ThemesTool(this.getProps());
    }

    /**
     * It creates new defaults of the tool.
     */
    createDefaults() {
        return new ThemesToolDefaults();
    }

    /**
     * It returns the tool state.
     */
    createState() {
        return new ThemesToolState();
    }

    /**
     * It creates new filter tool.
     */
    create() {
        // set theme
        this.setTheme(this.getState().getTheme());
    }

    /**
     * 
     * @param {*} theme 
     */
    setTheme(theme) {
        if(theme != undefined) {
            // if the theme tool is enabled, update map theme
            if(this.isEnabled()) {
                // update map container theme attribute (used by CSS selectors)
                document.getElementById(this.getMap().getId()).setAttribute(THEME_ATTR_NAME, theme.getType());

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
    getSidebarTabFragment() {
        if(this.tabFragment == undefined) {
            this.tabFragment = this.createSidebarTabFragment();
        }
        return this.tabFragment;
    }

    /**
     * It creates new tab fragment.
     */
    createSidebarTabFragment() {
        return new ThemesToolTabFragment({ tool: this });
    }
}
export default ThemesTool;