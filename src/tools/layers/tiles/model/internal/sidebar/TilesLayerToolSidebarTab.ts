import { AbstractLayerToolSidebarTab, ILayerToolSidebarTab, ILayerToolSidebarTabProps, ILayerToolSidebarTabDefaults } from "../../../../../sidebar";
import ITilesLayerTool from "../../types/tool/ITilesLayerTool";
import TilesLayerToolSidebarTabDefaults from "./TilesLayerToolSidebarTabDefaults";

/**
 * This class provides functions for management of the layer sidebar tab.
 * 
 * @author Jiri Hynek
 */
class TilesLayerToolSidebarTab extends AbstractLayerToolSidebarTab<ITilesLayerTool> implements ILayerToolSidebarTab {

    public constructor(tool: ITilesLayerTool, props: ILayerToolSidebarTabProps) {
        super(tool, props);
    } 

    /**
     * It creates new defaults of the sidebar tab.
     */
    public createDefaults(): ILayerToolSidebarTabDefaults {
        return new TilesLayerToolSidebarTabDefaults(this);
    }

    /**
     * It returns tab pane which will be placed in sidebar tab.
     */
    protected getContent(): HTMLElement {
        // for now, it returns empty div element
        return document.createElement("div");
    }

    // TODO: This class should be modified in future to provide settings for Map layer (e.g., different tile layers).
}
export default TilesLayerToolSidebarTab;