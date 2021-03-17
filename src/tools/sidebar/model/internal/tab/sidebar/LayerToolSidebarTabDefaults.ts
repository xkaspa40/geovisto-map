import { SidebarTabDefaults } from "../../../..
import ILayerToolSidebarTabDefaults from "../../../types/tab/layer/ILayerToolSidebarTabDefaults
import ILayerToolSidebarTab from "../../../types/tab/layer/ILayerToolSidebarTab

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class LayerToolSidebarTabDefaults extends SidebarTabDefaults implements ILayerToolSidebarTabDefaults {

    /**
     * It creates tab control defaults.
     */
    public constructor(sidebarTab: ILayerToolSidebarTab) {
        super(sidebarTab);
    }

    /**
     * It returns name of tab pane.
     */
    public getName(): string {
        return (<ILayerToolSidebarTab> this.getMapObject()).getTool().getState().getLayerName() + " settings";
    }

    /**
     * It returns the icon of the tab pane.
     */
    public getIcon(): string {
        return '<i class="fa fa-file"></i>';
    }
}
export default LayerToolSidebarTabDefaults;