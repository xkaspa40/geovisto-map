import { ISidebarTab, ISidebarTabDefaults, SidebarTabDefaults } from "../../../../sidebar";
import IMapObject from "../../../../../model/types/object/IMapObject";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class FiltersToolSidebarTabDefaults extends SidebarTabDefaults implements ISidebarTabDefaults {

    /**
     * It initializes sidebar tab control defaults.
     */
    public constructor(sidebarTab: ISidebarTab) {
        super(sidebarTab);
    }

    /**
     * It returns name of tab pane.
     */
    public getName(): string {
        return "Filters";
    }

    /**
     * It returns the icon of the tab pane.
     */
    public getIcon(): string {
        return '<i class="fa fa-filter"></i>';
    }

    /**
     * It returns the element class.
     */
    public getFilterRuleElementClass(): string {
        const mapObject: IMapObject | undefined = this.getMapObject();
        if(mapObject) {
            return mapObject.getType() + "-filter";
        }
        return "unknown-object-filter";
    }
}
export default FiltersToolSidebarTabDefaults;
