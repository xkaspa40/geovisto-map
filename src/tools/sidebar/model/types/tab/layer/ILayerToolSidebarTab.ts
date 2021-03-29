import { ISidebarTab } from "../../../..";
import ILayerToolSidebarTabDefaults from "./ILayerToolSidebarTabDefaults";
import ILayerToolSidebarTabState from "./ILayerToolSidebarTabState";
import ILayerTool from "../../../../../../model/types/layer/ILayerTool";
import ILayerToolDimensions from "../../../../../../model/types/layer/ILayerToolDimensions";

/**
 * This interface declares functions for management of a layer sidebar tab.
 * 
 * @author Jiri Hynek
 */
interface ILayerToolSidebarTab extends ISidebarTab {

    /**
     * It creates new defaults of the sidebar tab.
     */
    getDefaults(): ILayerToolSidebarTabDefaults;

    /**
     * It creates new state of the sidebar tab.
     */
    getState(): ILayerToolSidebarTabState;

    /**
     * Help function which returns the tool from the state.
     */
    getTool(): ILayerTool;

    /**
     * It updates inputs according to the given layer tool dimensions.
     * 
     * @param dimensions 
     */
    setInputValues(dimensions: ILayerToolDimensions): void;
}
export default ILayerToolSidebarTab;