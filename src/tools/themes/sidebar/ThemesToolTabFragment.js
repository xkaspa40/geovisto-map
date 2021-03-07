import AbstractTabFragment from '../../sidebar/model/internal/fragment/AbstractTabFragment';
import SettingsTool from '../../settings/model/internal/tool/SettingsTool';
import ThemesToolTabFragmentDefaults from './ThemesToolTabFragmentDefaults';
import ThemesToolTabFragmentState from './ThemesToolTabFragmentState';
import AutocompleteFormInput from '../../../model/internal/inputs/labeled/autocomplete/AutocompleteFormInput';
import SidebarInputFactory from '../../../model/internal/inputs/SidebarInputFactory';

/**
 * This class represents tab fragment for Themes tool.
 * 
 * TODO: exclude defaults and state variables
 * 
 * @author Jiri Hynek
 */
class ThemesToolTabFragment extends AbstractTabFragment {

    constructor(props) {
        super(props);

        // tab content
        this.tabContent = undefined;
    }

    /**
     * It creates new defaults of the tab fragment.
     */
    createDefaults() {
        return new ThemesToolTabFragmentDefaults();
    }

    /**
     * It creates new state of the tab fragment.
     */
    createState() {
        return new ThemesToolTabFragmentState();
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

        // theme input
        var tool = this.getState().getTool();
        var themesManager = tool.getState().getThemesManager();
        let changeTheme = function(e) {
            let newTheme = themesManager.getTheme(e.target.value);
            if(newTheme && newTheme.length > 0) {
                tool.setTheme(newTheme[0]);
            }
        }
        let themeInput = SidebarInputFactory.createSidebarInput(AutocompleteFormInput.ID(), { label: "Theme", options: themesManager.getThemeLabels(), action: changeTheme });
        this.tabContent.appendChild(themeInput.create());
        themeInput.setValue(tool.getState().getTheme().getType());
    }

}
export default ThemesToolTabFragment;