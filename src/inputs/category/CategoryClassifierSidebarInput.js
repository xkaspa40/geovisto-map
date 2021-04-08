import AbstractSidebarInput from "../AbstractSidebarInput";
import AutocompleteSidebarInput from "../input/AutocompleteSidebarInput";
import LabeledTextSidebarInput from "../input/LabeledTextSidebarInput";
import ColorPickerInput from "../input/ColorPickerInput";

const ID = "geovisto-input-category-classifier";

const COMPONENT_DIV_CLASS = ID;

/**
 * This class wraps inputs used for color codification of categories.
 *
 * @author Petr Kašpar
 */
class CategoryClassifierSidebarInput extends AbstractSidebarInput {

    constructor(params) {
        super(params);

        //data models
        this.opModel = params.operations;
        this.valModel = params.values;
        this.colorModel = params.colors;

        //inputs
        this.input = undefined;
        this.opInput = undefined;
        this.valInput = undefined;
        this.colorInput = undefined;
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
        this.colorInput = new ColorPickerInput({
            label: "Color",
            options: this.colorModel.options,
        });

        this.input.appendChild(this.opInput.create());
        this.input.appendChild(this.valInput.create());
        this.input.appendChild(this.colorInput.create());

        return this.input;
    }

    /**
     * It returns values of the inputs.
     */
    getValue() {
        return {
            op: this.opInput.getValue(),
            val: this.valInput.getValue(),
            color: this.colorInput.getValue()
        };
    }
}

export default CategoryClassifierSidebarInput;