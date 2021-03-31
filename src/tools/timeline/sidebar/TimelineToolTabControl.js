import TimelineLayerToolTabControlDefaults from "./TimelineLayerToolTabControlDefaults";
import TimelineToolTabControlState from "./TimelineToolTabControlState";
import AbstractLayerToolTabControl from "../../layers/abstract/sidebar/AbstractLayerToolTabControl";
import SidebarInputFactory from "../../../inputs/SidebarInputFactory";
import TabDOMUtil from "../../../util/TabDOMUtil";
import { isValid } from "date-fns";

/**
 * This class provides controls for management of the layer sidebar tab.
 *
 * @author Jiri Hynek
 */
class TimelineToolTabControl extends AbstractLayerToolTabControl {
    constructor(props) {
        super(props);
        this.initializeTimeline = props.tool.initializeTimeline;
        this.destructTimeline = props.tool.desctructTimeline;
    }

    /**
     * It creates new defaults of the tab control.
     */
    createDefaults() {
        return new TimelineLayerToolTabControlDefaults();
    }

    /**
     * It creates new state of the tab control.
     */
    createState() {
        return new TimelineToolTabControlState();
    }

    /**
     * It acquire selected data mapping from input values.
     */
    getInputValues() {
        // get data mapping model
        const model = this.getDefaults().getDataMappingModel();

        // create new selection
        const dataMapping = {
            [model.timePath.name]: this.timePathInput.getValue(),
            [model.stepTimeLength.name]: parseInt(this.stepTimeLengthInput.getValue()),
            [model.storyEnabled.name]: this.storyEnabledCheckbox.getValue(),
            [model.transitionTimeLength.name]: parseInt(this.transitionTimeLengthInput.getValue()),
            [model.story.name]: this.getTool()
                .getState()
                .getStoryByName(this.storySelect.getValue()),
            [model.realTimeEnabled.name]: this.realTimeCheckbox.getValue(),
            [model.granularity.name]: this.granularityInput.getValue(),
            [model.chartEnabled.name]: this.chartEnabledCheckbox.getValue(),
            [model.chartValuePath.name]: this.chartValuePathInput.getValue(),
            [model.chartAggregationFn.name]: this.chartAggregationFnInput.getValue(),
        };

        return dataMapping;
    }

    /**
     * It updates selected input values according to the given data mapping.
     *
     * @param {*} dataMapping
     */
    setInputValues(dataMapping) {
        // get data model
        const model = this.getDefaults().getDataMappingModel();

        // update inputs
        this.timePathInput.setValue(dataMapping[model.timePath.name]);
        this.stepTimeLengthInput.setValue(dataMapping[model.stepTimeLength.name]);
        this.storyEnabledCheckbox.setValue(dataMapping[model.storyEnabled.name]);
        this.transitionTimeLengthInput.setValue(dataMapping[model.transitionTimeLength.name]);
        this.storySelect.setValue(dataMapping[model.story.name]);
        this.realTimeCheckbox.setValue(dataMapping[model.realTimeEnabled.name]);
        this.granularityInput.setValue(dataMapping[model.granularity.name]);
        this.chartEnabledCheckbox.setValue(dataMapping[model.chartEnabled.name]);
        this.chartValuePathInput.setValue(dataMapping[model.chartValuePath.name]);
        this.chartAggregationFnInput.setValue(dataMapping[model.chartAggregationFn.name]);
    }

    /**
     * It returns the sidebar tab pane.
     */
    getTabContent() {
        // tab content
        const tabElement = document.createElement("div");
        const formElement = tabElement.appendChild(document.createElement("form"));

        // get data mapping model
        const model = this.getDefaults().getDataMappingModel();
        const dataDomainLabels = this.getTool()
            .getMap()
            .getState()
            .getMapData()
            .getDataDomainLabels();

        const updateFields = this.updateFields.bind(this);
        this.timePathInput = SidebarInputFactory.createSidebarInput(
            model.timePath.input,
            { label: model.timePath.label, options: this.getTimePaths(), action: updateFields }
        );
        this.stepTimeLengthInput = SidebarInputFactory.createSidebarInput(
            model.stepTimeLength.input,
            { label: model.stepTimeLength.label, type: "number" }
        );
        this.transitionTimeLengthInput = SidebarInputFactory.createSidebarInput(
            model.transitionTimeLength.input,
            { label: model.transitionTimeLength.label, type: "number" }
        );
        this.storyEnabledCheckbox = SidebarInputFactory.createSidebarInput(
            model.storyEnabled.input,
            { label: model.storyEnabled.label }
        );
        this.storySelect = SidebarInputFactory.createSidebarInput(
            model.story.input,
            {
                label: model.story.label,
                options: this.getTool().getState().getStories().map(({ name }) => name),
                action: updateFields
            }
        );
        this.addStoryButton = TabDOMUtil.createButton(
            "+",
            () => {
                this.getTool().getState().createStory(this.storySelect.getValue());
                this.storySelect.changeOptions(this.getTool()
                    .getState()
                    .getStories()
                    .map(({ name }) => name));
            },
            "geovisto-timeline-add-story-button"
        );
        this.realTimeCheckbox = SidebarInputFactory.createSidebarInput(
            model.realTimeEnabled.input,
            { label: model.realTimeEnabled.label }
        );
        this.granularityInput = SidebarInputFactory.createSidebarInput(
            model.granularity.input,
            {
                label: model.granularity.label,
                options: model.granularity.options,
                action: updateFields
            }
        );
        this.chartEnabledCheckbox = SidebarInputFactory.createSidebarInput(
            model.chartEnabled.input,
            { label: model.chartEnabled.label }
        );
        this.chartValuePathInput = SidebarInputFactory.createSidebarInput(
            model.chartValuePath.input,
            { label: model.chartValuePath.label, options: dataDomainLabels, action: updateFields }
        );
        this.chartAggregationFnInput = SidebarInputFactory.createSidebarInput(
            model.chartAggregationFn.input,
            {
                label: model.chartAggregationFn.label,
                options: model.chartAggregationFn.options,
                action: updateFields
            }
        );
        this.submitButton = TabDOMUtil.createButton(
            "Apply",
            () => this.onSubmitClick(),
            "timeline-apply-button",
        );

        formElement.appendChild(this.timePathInput.create());
        formElement.appendChild(this.stepTimeLengthInput.create());
        formElement.appendChild(document.createElement("hr"));

        formElement.appendChild(this.storyEnabledCheckbox.create());
        const storyWrapper = document.createElement("div");
        storyWrapper.style.display = "flex";
        storyWrapper.appendChild(this.storySelect.create());
        storyWrapper.appendChild(this.addStoryButton);
        formElement.appendChild(storyWrapper);
        formElement.appendChild(this.transitionTimeLengthInput.create());
        formElement.appendChild(document.createElement("hr"));

        formElement.appendChild(this.realTimeCheckbox.create());
        formElement.appendChild(this.granularityInput.create());
        formElement.appendChild(document.createElement("hr"));

        formElement.appendChild(this.chartEnabledCheckbox.create());
        formElement.appendChild(this.chartValuePathInput.create());
        formElement.appendChild(this.chartAggregationFnInput.create());
        formElement.appendChild(document.createElement("hr"));

        formElement.appendChild(this.submitButton);

        formElement.addEventListener("change", this.updateFields.bind(this))

        this.setInputValues(this.getTool().getState().getDataMapping());
        this.updateFields();

        return tabElement;
    }

    getTimePaths() {
        const data = this.getTool().getMap().getState().getMapData().getOriginalData();
        const metaPaths = this.getTool().getMap().getState().getMapData().getDataDomainLabels();
        let timePaths = [];
        const path = (pathString, obj) => pathString.split(".").reduce((o, i) => o[i], obj);

        for (let row = 0; row < data.length; row += 1) {
            timePaths = metaPaths.reduce(
                (validTimePaths, timePath) => (
                    isValid(new Date(path(timePath, data[row]))) ?
                        [...validTimePaths, timePath] :
                        validTimePaths
                ),
                [],
            );
            if (timePaths.length === 0) break;
        }

        return timePaths;
    }

    onSubmitClick() {
        this.initializeTimeline(this.getInputValues());
    }

    updateFields() {
        const {
            realTimeEnabled,
            timePath,
            stepTimeLength,
            storyEnabled,
            story,
            transitionTimeLength,
            chartEnabled,
            chartValuePath,
            granularity,
            chartAggregationFn,
        } = this.getInputValues()
        this.granularityInput.setDisabled(!realTimeEnabled);
        this.chartValuePathInput.setDisabled(!chartEnabled);
        this.chartAggregationFnInput.setDisabled(!chartEnabled);

        const isStorySectionValid =  !storyEnabled || (storyEnabled && story && transitionTimeLength > 0);
        this.storySelect.setDisabled(!storyEnabled);
        this.addStoryButton.disabled = !storyEnabled;
        this.transitionTimeLengthInput.setDisabled(!storyEnabled);

        this.submitButton.disabled = !timePath ||
            !isStorySectionValid ||
            !stepTimeLength || stepTimeLength <= 0 ||
            !transitionTimeLength || transitionTimeLength <= 0 ||
            (chartEnabled && (!chartValuePath || !chartAggregationFn)) ||
            (realTimeEnabled && !granularity);
    }

    setTabContentChecked(checked) {
        checked && this.updateFields();
        !checked && this.destructTimeline();
    }
}

export default TimelineToolTabControl;
