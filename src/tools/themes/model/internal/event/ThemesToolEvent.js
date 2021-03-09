import GenericObjectEvent from "../../../../../model/internal/event/generic/MapChangeEvent";


/**
 * This class provides the theme change event.
 * 
 * @author Jiri Hynek
 */
class ThemesToolEvent extends GenericObjectEvent {

    /**
     * It initializes event.
     */
    constructor(themesTool, theme) {
        super(ThemesToolEvent.TYPE(), themesTool, theme);
        this.theme = theme;
    }

    /**
     * Type of the event.
     */
    static TYPE() {
        return "themes-tool-event";
    }
}
export default ThemesToolEvent;