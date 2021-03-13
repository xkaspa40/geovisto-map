import MapObjectDefaults from "../../../../../model/internal/object/MapObjectDefaults";
import ISidebarFragmentDefaults from "../../types/fragment/ISidebarFragmentDefaults";
import ISidebarFragment from "../../types/fragment/ISidebarFragment";
import ISidebarFragmentConfig from "../../types/fragment/ISidebarFragmentConfig";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class SidebarFragmentDefaults extends MapObjectDefaults implements ISidebarFragmentDefaults {

    /**
     * It initializes a sidebar fragment defaults.
     * 
     * @param sidebarFragment
     */
    constructor(sidebarFragment: ISidebarFragment) {
        super(sidebarFragment);
    }

    /**
     * It returns the default config.
     */
    public getConfig(): ISidebarFragmentConfig {
        const config = <ISidebarFragmentConfig> super.getConfig();
        config.tool = undefined,
        config.enabled = undefined;
        return config;
    }

    /**
     * It returns a unique type string of the sidebar fragment.
     */
    public getType(): string {
        return "geovisto-sidebar-fragment";
    }

    /**
     * It returns a logical value whether the sidebar fragment is enabled.
     */
    public isEnabled(): boolean {
        return true;
    }
}
export default SidebarFragmentDefaults;