import SidebarTabState from "../SidebarTabState
import ILayerToolSidebarTab from "../../../types/tab/layer/ILayerToolSidebarTab
import ILayerToolSidebarTabConfig from "../../../types/tab/layer/ILayerToolSidebarTabConfig
import ILayerToolSidebarTabState from "../../../types/tab/layer/ILayerToolSidebarTabState

/**
 * This class manages the state of the sidebar tab.
 * It wraps the state since the sidebar tab can work with state objects which needs to be explicitly serialized.
 * 
 * @author Jiri Hynek
 */
class LayerToolSidebarTabState extends SidebarTabState implements ILayerToolSidebarTabState {

    /**
     * It creates a tab control state.
     */
    public constructor(sidebarTab: ILayerToolSidebarTab) {
        super(sidebarTab);
    }

    /**
     * The function takes config and deserializes the values.
     * 
     * @param config 
     */
    public deserialize(config: ILayerToolSidebarTabConfig): void {
        if(config.enabled != undefined) this.setEnabled(config.enabled);
        if(config.name != undefined) this.setName(config.name);
        if(config.icon != undefined) this.setIcon(config.icon);
        if(config.checkButton != undefined) this.setCheckButton(config.checkButton);
    }

    /**
     * The method serializes the sidebar tab control configuration.
     * Optionally, a serialized value can be let undefined if it equals the default value.
     * 
     * @param filterDefaults 
     */
    public serialize(filterDefaults: boolean | undefined): ILayerToolSidebarTabConfig {
        return super.serialize(filterDefaults);
    }
}
export default LayerToolSidebarTabState;