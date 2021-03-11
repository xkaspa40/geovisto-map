import IMapObjectDefaults from "../../../../../model/types/object/IMapObjectDefaults";
import ISidebarTabConfig from "./ISidebarTabConfig";

/**
 * This interface declares functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
interface ISidebarTabDefaults extends IMapObjectDefaults {

    /**
     * It returns the default config.
     */
    getConfig(): ISidebarTabConfig;

    /**
     * It returns whether the default value the sidebar tab is enabled.
     */
    isEnabled(): boolean;

    /**
     * It returns name of the sidebar tab.
     */
    getName(): string;

    /**
     * It returns the icon of the sidebar tab.
     */
    getIcon(): string;

    /**
     * It returns a logical value whether the sidebar tab contains a check button used to enable/disable the tool.
     */
    hasCheckButton(): boolean
}
export default ISidebarTabDefaults;