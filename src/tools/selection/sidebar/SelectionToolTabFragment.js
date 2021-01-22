import AbstractTabFragment from '../../sidebar/model/fragment/AbstractTabFragment';
import SettingsTool from '../../settings/SettingsTool';
import SelectionToolTabFragmentDefaults from './SelectionToolTabFragmentDefaults';
import SelectionToolTabFragmentState from './SelectionToolTabFragmentState';

/**
 * This class represents tab fragment for Themes tool.
 * 
 * @author Jiri Hynek
 */
class SelectionToolTabFragment extends AbstractTabFragment {

    constructor(props) {
        super(props);

        // tab content
        this.tabContent = undefined;
    }

    /**
     * It creates new defaults of the tab fragment.
     */
    createDefaults() {
        return new SelectionToolTabFragmentDefaults();
    }

    /**
     * It creates new state of the tab fragment.
     */
    createState() {
        return new SelectionToolTabFragmentState();
    }

    /**
     * The function returns true if the tab fragment should be included in the tab control.
     * 
     * @param {*} tabControl 
     */
    isChild(tabControl) {
        return tabControl.getState().getTool().getType() == SettingsTool.TYPE();
    }

    /**
     * It returns fragment of tab pane which will be placed in sidebar tab.
     * 
     * This function can be extended.
     */
    getTabContent() {
        if(this.tabContent == undefined) {
            this.createTabContent();
        }
        return this.tabContent;
    }

    /**
     * Help function which creates tab content.
     */
    createTabContent() {
        // tab pane
        this.tabContent = document.createElement('div');

        // TODO ... (selection settings)
    }

}
export default SelectionToolTabFragment;