import ConnectionLayerToolTabControlDefaults from "./ConnectionLayerToolTabControlDefaults";
import ConnectionLayerToolTabControlState from "./ConnectionLayerToolTabControlState";
import AbstractLayerToolTabControl from "../../abstract/sidebar/AbstractLayerToolTabControl";
import SidebarInputFactory from "../../../../inputs/SidebarInputFactory";

/**
 * This class provides controls for management of the layer sidebar tab.
 *
 * @author Jiri Hynek
 */
class ConnectionLayerToolTabControl extends AbstractLayerToolTabControl {

    constructor(tool) {
        super(tool);

        this.tabContent = undefined;
    }

    /**
     * It creates new defaults of the tab control.
     */
    createDefaults() {
        return new ConnectionLayerToolTabControlDefaults();
    }

    /**
     * It creates new state of the tab control.
     */
    createState() {
        return new ConnectionLayerToolTabControlState();
    }

    /**
     * It acquire selected data mapping from input values.
     */
    getInputValues() {
        // get data mapping model
        let model = this.getDefaults().getDataMappingModel();

        // create new selection
        let dataMapping = {};

        // get selected data domains values
        dataMapping[model.from.name] = this.inputFrom.getValue();
        dataMapping[model.to.name] = this.inputTo.getValue();
        dataMapping[model.animateDirection.name] = this.animateDirectionCheckbox.getValue();

        return dataMapping;
    }

    /**
     * It updates selected input values according to the given data mapping.
     *
     * @param {*} dataMapping
     */
    setInputValues(dataMapping) {
        // get data mapping model
        let model = this.getDefaults().getDataMappingModel();

        // update inputs
        this.inputFrom.setValue(dataMapping[model.from.name]);
        this.inputTo.setValue(dataMapping[model.to.name]);
        this.animateDirectionCheckbox.setValue(dataMapping[model.animateDirection.name]);
    }

    /**
     * It returns the sidebar tab pane.
     */
    getTabContent() {
        var _this = this;

        // event handler: change dimension action
        let changeDimensionAction = function(e) {
            // get selected values and update layer's data mapping
            _this.getTool().updateDataMapping(_this.getInputValues());
        }

        // tab content
        let tab = document.createElement('div');
        let elem = tab.appendChild(document.createElement('div'));

        // get data mapping model
        let model = this.getDefaults().getDataMappingModel();
        let dataDomainLabels = this.getTool().getMap().getState().getMapData().getDataDomainLabels();

        // select from
        this.inputFrom = SidebarInputFactory.createSidebarInput(model.from.input, { label: model.from.label , options: dataDomainLabels, action: changeDimensionAction });
        elem.appendChild(this.inputFrom.create());

        // select to
        this.inputTo = SidebarInputFactory.createSidebarInput(model.to.input, { label: model.to.label , options: dataDomainLabels, action: changeDimensionAction });
        elem.appendChild(this.inputTo.create());

        // select to
        this.animateDirectionCheckbox = SidebarInputFactory.createSidebarInput(
            model.animateDirection.input,
            { label: model.animateDirection.label, action: (e) => this.getTool().animateDirection(e.target.checked)}
        );
        elem.appendChild(this.animateDirectionCheckbox.create());

        this.setInputValues(this.getTool().getState().getDataMapping());

        return tab;
    }

}
export default ConnectionLayerToolTabControl;
