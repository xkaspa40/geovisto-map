import IMapChangeEvent from "../../../../../model/types/event/IMapChangeEvent";
import IMapTheme from "../theme/IMapTheme";
import IThemesTool from "../tool/IThemesTool";

/**
 * This interface declares the theme change event.
 * 
 * @author Jiri Hynek
 */
interface IThemesToolEvent extends IMapChangeEvent {

    /**
     * Return the themes tool which invoked this event.
     */
    getSource(): IThemesTool;

    /**
     * It returns a new theme descritpion of the theme change event.
     */
    getObject(): IMapTheme;
}
export default IThemesToolEvent;