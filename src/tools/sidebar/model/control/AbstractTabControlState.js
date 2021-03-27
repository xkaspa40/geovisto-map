import AbstractMapObjectState from "../../../../model/object/abstract/AbstractMapObjectState";
import AbstractTabControlDefaults from "./AbstractTabControlDefaults";

/**
 * This class manages the state of the sidebar tab.
 * It wraps the state since the sidebar tab can work with state objects which needs to be explicitly serialized.
 * 
 * @author Jiri Hynek
 */
class AbstractTabControlState extends AbstractMapObjectState {

    /**
     * It creates a tab control state.
     */
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
        // store the tool which provides this sidebar tab
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
        this.setName(props.name == undefined && defaults ? defaults.getName() : props.name);
        this.setIcon(props.icon == undefined && defaults ? defaults.getIcon() : props.icon);
        this.setCheckButton(props.checkButton == undefined && defaults ? defaults.getCheckButton() : props.checkButton);
        this.setEnabled(props.enabled == undefined && defaults ? defaults.isEnabled() : props.enabled);
    }

    /**
     * The function takes config and desrializes the values.
     * 
     * @param {*} tabControl 
     * @param {*} config 
     */
    deserialize(tabControl, config) {
        if (config.enabled != undefined) this.setEnabled(config.enabled);
        if (config.name != undefined) this.setName(config.name);
        if (config.icon != undefined) this.setIcon(config.icon);
        if (config.checkButton != undefined) this.setCheckButton(config.checkButton);

        this.deserializeFragments(tabControl, config);
    }

    /**
     * The function takes config and deserializes the tab fragments.
     * 
     * @param {AbstractTabControl} tabControl 
     * @param {*} config 
     */
    deserializeFragments(tabControl, config) {
        let fragments = [];
        let fragment;
        let tool;
        // process tab fragments
        if (config.fragments) {
            let fragmentConfig;
            for (let i = 0; i != config.fragments.length; i++) {
                fragmentConfig = config.fragments[i];
                if (fragmentConfig.tool) {
                    tool = this.getTool().getMap().getState().getTools().getById(fragmentConfig.tool);
                    if (tool && tool.getSidebarTabFragment) {
                        fragment = tool.getSidebarTabFragment();
                        if (fragment && fragment.isChild(tabControl)) {
                            fragment.initialize(tabControl, fragmentConfig);
                            fragments.push(fragment);
                        }
                    }
                }
            }
        } else {
            // try to look for fragments if not specified in config
            let tools = this.getTool().getMap().getState().getTools().getObjects();
            for (let i = 0; i < tools.length; i++) {
                if (tools[i].getSidebarTabFragment) {
                    fragment = tools[i].getSidebarTabFragment();
                    if (fragment && fragment.isChild(tabControl)) {
                        fragment.initialize(tabControl, undefined);
                        fragments.push(fragment);
                    }
                }
            }
        }

        this.setTabFragments(fragments.length > 0 ? fragments : undefined);
    }

    /**
     * The method serializes the sidebar tab control configuration.
     * Optionally, a serialed value can be let undefined if it equals the default value.
     * 
     * @param {*} defaults 
     */
    serialize(defaults) {
        // do not serialize id and type - it is not necessary for deserialization

        let config = {
            tool: this.getTool().getId(),
            enabled: defaults && this.enabled == defaults.isEnabled() ? undefined : this.enabled,
            name: defaults && this.name == defaults.isEnabled() ? undefined : this.name,
            icon: defaults && this.icon == defaults.isEnabled() ? undefined : this.icon,
            checkButton: defaults && this.checkButton == defaults.isEnabled() ? undefined : this.checkButton
        };

        // serialize tab fragments
        if (this.fragments != undefined) {
            config.fragments = [];
            for (let i = 0; i != this.fragments.length; i++) {
                config.fragments.push(this.fragments[i].getState().serialize(this.fragments[i].getDefaults()));
            }
        }

        return config;
    }

    /**
     * It returns the tool property of the sidebar tab control state.
     */
    getTool() {
        return this.tool;
    }

    /**
     * It sets the tool property of the sidebar tab control state.
     * It can be set only once.
     * 
     * @param {*} tool 
     */
    setTool(tool) {
        this.tool = (this.tool == undefined) ? tool : this.tool;
    }

    /**
     * It returns the enabled property of the sidebar tab control state.
     */
    isEnabled() {
        return this.enabled;
    }

    /**
     * It sets the enabled property of the sidebar tab control state.
     * 
     * @param {*} enabled 
     */
    setEnabled(enabled) {
        this.enabled = enabled;
    }

    /**
     * It returns the name property of the sidebar tab control state.
     */
    getName() {
        return this.name;
    }

    /**
     * It sets the name property of the sidebar tab control state.
     * 
     * @param {*} name 
     */
    setName(name) {
        this.name = name;
    }

    /**
     * It returns the icon property of the sidebar tab control state.
     */
    getIcon() {
        return this.icon;
    }

    /**
     * It sets the icon property of the sidebar tab control state.
     * 
     * @param {*} icon
     */
    setIcon(icon) {
        this.icon = icon;
    }

    /**
     * It returns the checkButton property of the sidebar tab control state.
     */
    hasCheckButton() {
        return this.checkButton;
    }

    /**
     * It sets the checkButton property of the sidebar tab control state.
     * 
     * @param {*} checkButton 
     */
    setCheckButton(checkButton) {
        this.checkButton = checkButton;
    }

    /**
     * It returns the sidebar property of the sidebar tab control state.
     */
    getSidebar() {
        return this.sidebar;
    }

    /**
     * It sets the sidebar property of the sidebar tab control state.
     * It can be set only once.
     * 
     * @param {*} sidebar 
     */
    setSidebar(sidebar) {
        this.sidebar = (this.sidebar == undefined) ? sidebar : this.sidebar;
    }

    /**
     * It returns the tabPane property of the sidebar tab control state.
     */
    getTabPane() {
        return this.tabPane;
    }

    /**
     * It sets the tabPane property of the sidebar tab control state.
     * It can be set only once.
     * 
     * @param {*} tabPane 
     */
    setTabPane(tabPane) {
        this.tabPane = (this.tabPane == undefined) ? tabPane : this.tabPane;
    }

    /**
     * It returns the fragments property of the tool state.
     */
    getTabFragments() {
        return this.fragments;
    }

    /**
     * It sets the fragments property of the tool state.
     * 
     * @param {*} fragments 
     */
    setTabFragments(fragments) {
        this.fragments = fragments;
    }
}
export default AbstractTabControlState;