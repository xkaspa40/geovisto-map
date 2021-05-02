import AbstractSidebarInput from "../AbstractSidebarInput";
import AutocompleteSidebarInput from "../input/AutocompleteSidebarInput";
import LabeledTextSidebarInput from "../input/LabeledTextSidebarInput";
import SidebarInputFactory from "../SidebarInputFactory";

const ID = "geovisto-input-category-classifier";

const COMPONENT_DIV_CLASS = ID;

/**
 * This class wraps inputs used for color codification of categories.
 *
 * @author Petr Kašpar
 */
class DynamicClassifierSidebarInput extends AbstractSidebarInput {

    constructor(params) {
        super(params);

        //data models
        this.opModel = params.operations;
        this.valModel = params.values;
        this.dynamicModel = params.dynamic;

        //inputs
        this.input = undefined;
        this.opInput = undefined;
        this.valInput = undefined;
        this.dynamicInput = undefined;
    }

    create() {
        if (this.input !== undefined) {
            return this.input;
        }

        this.input = document.createElement("div");
        this.input.classList.add(COMPONENT_DIV_CLASS);

        this.opInput = new AutocompleteSidebarInput({
            label: "Operation",
            options: this.opModel.options,
            action: this.opModel.action,
            placeholder: "choose operation"
        });
        this.valInput = new LabeledTextSidebarInput({
            label: "Value",
            action: this.valModel.action,
            placeholder: "enter value"
        });
        this.dynamicInput = SidebarInputFactory.createSidebarInput(this.dynamicModel.input, {
            label: this.dynamicModel.label,
            action: this.dynamicModel.action,
            options: this.dynamicModel.options,
            placeholder: this.dynamicModel.placeholder
        });

        this.input.appendChild(this.opInput.create());
        this.input.appendChild(this.valInput.create());
        this.input.appendChild(this.dynamicInput.create());

        return this.input;
    }

    /**
     * It returns values of the inputs.
     */
    getValue() {
        return {
            op: this.opInput.getValue(),
            val: this.valInput.getValue(),
            [this.dynamicModel.key]: this.dynamicInput.getValue()
        };
    }

    /**
     * Sets value for all three inputs
     *
     * @param value - object
     */
    setValue(value) {
        this.opInput.setValue(value.operation);
        this.valInput.setValue(value.value);
        this.dynamicInput.setValue(value[this.dynamicModel.key]);
    }
}

export default DynamicClassifierSidebarInput;