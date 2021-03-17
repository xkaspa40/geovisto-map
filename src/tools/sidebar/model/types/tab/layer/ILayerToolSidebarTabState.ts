import { ISidebarTabState } from "../../../..";

/**
 * This interface declares the state of the sidebar tab.
 * It wraps the state since the sidebar tab can work with state objects which needs to be explicitly serialized.
 * 
 * @author Jiri Hynek
 */
type ILayerToolSidebarTabState = ISidebarTabState
export default ILayerToolSidebarTabState;