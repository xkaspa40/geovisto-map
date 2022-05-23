import AbstractLayerToolTabControlState from "../../abstract/sidebar/AbstractLayerToolTabControlState";


/**
 * This class manages the state of the sidebar tab.
 * It wraps the state since the sidebar tab can work with state objects which needs to be explicitly serialized.
 * 
 * @author Petr Kaspar
 */
class BubbleLayerToolTabControlState extends AbstractLayerToolTabControlState {

    /**
     * It creates a tab control state.
     */
    constructor() {
        super();
    }
}
export default BubbleLayerToolTabControlState;