import AbstractMapObjectState from "../../../../model/object/abstract/AbstractMapObjectState";

/**
 * This class manages the state of the sidebar fragment.
 * It wraps the state since the sidebar fragment can work with state objects which needs to be explicitly serialized.
 * 
 * @author Jiri Hynek
 */
class AbstractTabFragmentState extends AbstractMapObjectState {

    constructor() {
        super();
    }

    /**
     * It initializes the state using the initial props. Optionally, defaults can be set if property is undefined.
     * 
     * @param {*} props 
     * @param {*} defaults 
     */
    initialize(props, defaults) {
        // store the tool which provides this sidebar fragment
        // props.tool should not be undefined
        this.setTool(props.tool);

        super.initialize(props, defaults);
    }

    /**
     * It resets state with respect to initial props. Optionally, defaults can be set if property is undefined.
     * 
     * @param {AbstractTabControlDefaults} defaults 
     */
    reset(defaults) {
        super.reset(defaults);

        let props = this.getProps();

        // set remaining properties if not set
        this.setEnabled(props.enabled == undefined && defaults ? defaults.isEnabled() : props.enabled);
    }

    /**
     * The metod takes config and desrializes the values.
     * 
     * @param {*} config 
     */
    deserialize(config) {
        if(config.enabled != undefined) this.setEnabled(config.enabled);
    }

    /**
     * The method serializes the sidebar tab fragment configuration.
     * Optionally, a serialed value can be let undefined if it equals the default value.
     * 
     * @param {*} defaults 
     */
    serialize(defaults) {
        return {
            tool: this.getTool().getId(),
            enabled: defaults && this.isEnabled == defaults.isEnabled() ? undefined : this.isEnabled(),
        }
    }

    /**
     * It returns the tool property of the sidebar tab fragment state.
     */
    getTool() {
        return this.tool;
    }

    /**
     * It sets the tool property of the sidebar tab fragment state.
     * It can be set only once.
     * 
     * @param {*} tool 
     */
    setTool(tool) {
       this.tool = (this.tool == undefined) ? tool : this.tool;
    }

    /**
     * It returns the enabled property of the sidebar tab fragment state.
     */
    isEnabled() {
        return this.enabled;
    }

    /**
     * It sets the enabled property of the sidebar tab fragment state.
     * 
     * @param {*} enabled 
     */
    setEnabled(enabled) {
       this.enabled = enabled;
    }

    /**
     * It returns the tab control property of the sidebar fragment control state.
     */
    getTabControl() {
        return this.tabControl;
    }

    /**
     * It sets the tab control property of the sidebar tab contrfragmentol state.
     * It can be set only once.
     * 
     * @param {*} tabControl 
     */
    setTabControl(tabControl) {
       this.tabControl = (this.tabControl == undefined) ? tabControl : this.tabControl;
    }

    /**
     * It returns the content property of the sidebar tab framgent state.
     */
    getContent() {
        return this.content;
    }

    /**
     * It sets the content property of the sidebar tab control state.
     * It can be set only once.
     * 
     * @param {*} content 
     */
    setContent(content) {
       this.content = (this.content == undefined) ? content : this.content;
    }
}
export default AbstractTabFragmentState;