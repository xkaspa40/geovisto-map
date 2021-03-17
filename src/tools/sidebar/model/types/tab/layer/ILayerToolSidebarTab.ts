import { ISidebarTab } from "../../../..";
import ILayerToolSidebarTabDefaults from "./ILayerToolSidebarTabDefaults";
import ILayerToolSidebarTabState from "./ILayerToolSidebarTabState";
import ILayerTool from "../../../../../../model/types/layer/ILayerTool";

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
     * It acquire selected data mapping from input values.
     */
    getInputValues(): any;

    /**
     * It updates selected items according to the given selection.
     * 
     * TODO: define type.
     * 
     * @param dataMapping 
     */
    setInputValues(dataMapping: any): void;
}
export default ILayerToolSidebarTab;