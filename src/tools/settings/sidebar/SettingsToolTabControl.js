import AbstractTabControl from "../../sidebar/model/control/AbstractTabControl";
import SettingsToolTabControlDefaults from "./SettingsToolTabControlDefaults";
import SettingsToolTabControlState from "./SettingsToolTabControlState";

/**
 * This class provides controls for management of the settings sidebar tab.
 * 
 * @author Jiri Hynek
 */
class SettingsTabControl extends AbstractTabControl {

    constructor(props) {
        super(props);

        this.tabContent = undefined;
    }

    /**
     * It creates new defaults of the tab control.
     */
    createDefaults() {
        return new SettingsToolTabControlDefaults();
    }

    /**
     * It creates new state of the tab control.
     */
    createState(props, defaults) {
        return new SettingsToolTabControlState(props, defaults);
    }

    /**
     * It returns generic layer tab pane.
     */
    getTabContent() {
        if(this.tabContent == undefined) {
            // tab pane contains empty div element
            this.tabContent = document.createElement('div');

            // it provides control with empty tab - tab fragments can be appended
        }

        return this.tabContent; 
    }

}
export default SettingsTabControl;