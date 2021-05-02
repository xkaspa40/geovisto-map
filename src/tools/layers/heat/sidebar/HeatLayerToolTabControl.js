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
        dataMapping[model.radius.name] = this.inputRadius.getValue();
        dataMapping[model.blur.name] = this.inputBlur.getValue();
        dataMapping[model.gradient.name] = this.inputGradient.getValue();
        dataMapping[model.zoom.name] = this.inputZoom.getValue();

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
        this.inputRadius.setValue(dataMapping[model.radius.name]);
        this.inputGradient.setValue(dataMapping[model.gradient.name]);
        this.inputZoom.setValue(dataMapping[model.zoom.name]);
        this.inputBlur.setValue(dataMapping[model.blur.name]);
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

        //select intensity
        this.inputIntensity = SidebarInputFactory.createSidebarInput(model.intensity.input, { label: model.intensity.label, options: dataDomainLabels, action: () => this.changeDimensionAction() });
        elem.appendChild(this.inputIntensity.create());

        //select radius
        this.inputRadius = SidebarInputFactory.createSidebarInput(model.radius.input, {
            label: model.radius.label,
            action: () => {this.changeDimensionAction()},
            placeholder: "insert number)",
            static: true
        });
        elem.appendChild(this.inputRadius.create());

        this.inputGradient = SidebarInputFactory.createSidebarInput(model.gradient.input, {
            label: model.gradient.label,
            action: () => {this.changeDimensionAction()},
            options: this.getTool().getState().getGradients(),
            placeholder: "select gradient:",
        });
        elem.appendChild(this.inputGradient.create());

        this.inputBlur = SidebarInputFactory.createSidebarInput(model.blur.input, {
            label: model.blur.label,
            action: () => {this.changeDimensionAction()},
            placeholder: "insert number"
        });
        elem.appendChild(this.inputBlur.create());

        this.inputZoom = SidebarInputFactory.createSidebarInput(model.zoom.input, {
            label: model.zoom.label,
            action: () => {this.changeDimensionAction()},
            options: this.getTool().getState().getZoomLevels(),
            placeholder: "choose ratio: "
        });
        elem.appendChild(this.inputZoom.create());

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