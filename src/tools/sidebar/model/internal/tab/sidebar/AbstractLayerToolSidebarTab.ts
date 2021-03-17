import LayerToolSidebarTabDefaults from "./LayerToolSidebarTabDefaults";
import LayerToolSidebarTabState from "./LayerToolSidebarTabState";
import { AbstractSidebarTab } from "../../../..
import ILayerTool from "../../../../../../model/types/layer/ILayerTool";
import ILayerToolSidebarTabProps from "../../../types/tab/layer/ILayerToolSidebarTabProps
import ILayerToolSidebarTab from "../../../types/tab/layer/ILayerToolSidebarTab
import ILayerToolSidebarTabDefaults from "../../../types/tab/layer/ILayerToolSidebarTabDefaults
import ILayerToolSidebarTabState from "../../../types/tab/layer/ILayerToolSidebarTabState

/**
 * This class provides controls for management of the layer sidebar tab.
 * 
 * @author Jiri Hynek
 */
abstract class AbstractLayerToolSidebarTab<T extends ILayerTool> extends AbstractSidebarTab<T> implements ILayerToolSidebarTab {

    public constructor(tool: T, props: ILayerToolSidebarTabProps | undefined) {
        super(tool, props);
    }

    /**
     * It returns the props given by the programmer.
     */
    public getProps(): ILayerToolSidebarTabProps {
        return <ILayerToolSidebarTabProps> super.getProps();
    }
    
    /**
     * It returns default values of the sidebar tab.
     */
    public getDefaults(): ILayerToolSidebarTabDefaults {
        return <ILayerToolSidebarTabDefaults> super.getDefaults();
    }

    /**
     * It creates new defaults of the sidebar tab.
     */
    protected createDefaults(): ILayerToolSidebarTabDefaults {
        return <ILayerToolSidebarTabDefaults> new LayerToolSidebarTabDefaults(this);
    }

    /**
     * It returns the sidebar tab state.
     */
    public getState(): ILayerToolSidebarTabState {
        return <ILayerToolSidebarTabState> super.getState();
    }

    /**
     * It creates the sidebar tab state.
     */
    protected createState(): ILayerToolSidebarTabState {
        return <ILayerToolSidebarTabState> new LayerToolSidebarTabState(this);
    }

    /**
     * It acquire selected data mapping from input values.
     * 
     * This function is intended to be extended.
     */
    public getInputValues(): any {
        return {};
    }

    /**
     * It updates selected items according to the given selection.
     * 
     * This function is intended to be extended.
     * 
     * TODO: 
     * 
     * @param dataMapping 
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    public setInputValues(dataMapping: any): void {
    }
}
export default AbstractLayerToolSidebarTab;