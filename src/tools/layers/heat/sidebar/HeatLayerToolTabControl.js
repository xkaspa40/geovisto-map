import HeatLayerToolTabControlDefaults from "./HeatLayerToolTabControlDefaults";
import HeatLayerToolTabControlState from "./HeatLayerToolTabControlState";
import AbstractLayerToolTabControl from "../../abstract/sidebar/AbstractLayerToolTabControl";
import SidebarInputFactory from "../../../../inputs/SidebarInputFactory";

/**
 * This class provides controls for management of the layer sidebar tab.
 * 
 * @author Jiri Hynek
 */
class HeatLayerToolTabControl extends AbstractLayerToolTabControl {

    constructor(tool) {
        super(tool);

        this.tabContent = undefined;
    }

    /**
     * It creates new defaults of the tab control.
     */
    createDefaults() {
        return new HeatLayerToolTabControlDefaults();
    }

    /**
     * It creates new state of the tab control.
     */
    createState() {
        return new HeatLayerToolTabControlState();
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
        dataMapping[model.latitude.name] = this.inputLatitude.getValue();
        dataMapping[model.longitude.name] = this.inputLongitude.getValue();
        dataMapping[model.intensity.name] = this.inputIntensity.getValue();

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
        this.inputLatitude.setValue(dataMapping[model.latitude.name]);
        this.inputLongitude.setValue(dataMapping[model.longitude.name]);
        this.inputIntensity.setValue(dataMapping[model.intensity.name]);
    }

    /**
     * It returns the sidebar tab pane.
     */
    getTabContent() {
        // tab content
        let tab = document.createElement('div');
        let elem = tab.appendChild(document.createElement('div'));

        // get selection model
        let model = this.getDefaults().getDataMappingModel();
        let dataDomainLabels = this.getTool().getMap().getState().getMapData().getDataDomainLabels();

        this.defineLatLngInputs();
        // select latitude
         elem.appendChild(this.inputLatitude.create());

        // select longitude
        elem.appendChild(this.inputLongitude.create());

        //select radius
        this.inputRadius = SidebarInputFactory.createSidebarInput(model.radiusStatic.input, {
            label: model.radiusStatic.label,
            action: (e) => {this.changeRadiusAction(e.target.value)},
            placeholder: "enter value:",
            static: true
        });
        elem.appendChild(this.inputRadius.create());

        //select intensity
        this.inputIntensity = SidebarInputFactory.createSidebarInput(model.intensity.input, { label: model.intensity.label, options: dataDomainLabels, action: () => this.changeDimensionAction() });
        elem.appendChild(this.inputIntensity.create());

        this.setInputValues(this.getTool().getState().getDataMapping());
        
        return tab;
    }

    /**
     * Event handler: change dimension action
     */
    changeDimensionAction() {
        // get selected values and update layer's data mapping
        this.getTool().updateDataMapping(this.getInputValues());
    }

    /**
     * Event handler: change radius action
     *
     * @param value
     */
    changeRadiusAction(value) {
        this.getTool().setRadius(value);
        this.changeDimensionAction();
    }

    /**
     * Creates Lat and Lng inputs
     */
    defineLatLngInputs() {
        let model = this.getDefaults().getDataMappingModel();
        let dataDomainLabels = this.getTool().getMap().getState().getMapData().getDataDomainLabels();

        this.inputLatitude = SidebarInputFactory.createSidebarInput(model.latitude.input, {
            label: model.latitude.label ,
            options: dataDomainLabels,
            action: () => this.changeDimensionAction()
        });
        this.inputLongitude = SidebarInputFactory.createSidebarInput(model.longitude.input, {
            label: model.longitude.label ,
            options: dataDomainLabels,
            action: () => this.changeDimensionAction()
        });
    }
}
export default HeatLayerToolTabControl;