import TextSidebarInput from "./TextSidebarInput";
import TabDOMUtil from "../../util/TabDOMUtil";

const ID = "geovisto-input-text-labeled";

const COMPONENT_DIV_LABEL_CLASS = ID + "-label";

const COMPONENT_DIV_INPUT_CLASS = ID + "-component";

const COMPONENT_INPUT_CLASS = ID + "-value";

const COMPONENT_INPUT_PLACEHOLDER = "choose dimension";

/**
 * This class represents labeled text sidebar input.
 *
 * @author Jiri Hynek
 */
class LabeledTextSidebarInput extends TextSidebarInput {

    constructor(settings) {
        super(settings);
        this.label = settings.label;
        this.placeholder = settings.placeholder ?? COMPONENT_INPUT_PLACEHOLDER;
        this.formDiv = undefined;
    }

    /**
     * Static function returns identifier of the input type.
     */
    static ID() {
        return ID;
    }

    /**
     * It returns input element.
     */
    create() {
        this.createForm();

        this.createListeners();
        return this.formDiv;
    }

    /**
     * Creates the input
     */
    createForm() {
        this.formDiv = document.createElement('div');
        this.formDiv.classList.add(ID);

        // label div
        let labelDiv = document.createElement('div');
        labelDiv.classList.add(COMPONENT_DIV_LABEL_CLASS);
        labelDiv.innerHTML = this.label;

        // input div
        this.inputDiv = document.createElement('div');
        this.inputDiv.classList.add(COMPONENT_DIV_INPUT_CLASS);

        // input
        this.input = document.createElement('input');
        TabDOMUtil.setAttributes(this.input,
            [ "class", "type", 'placeholder', 'type' ],
            [ COMPONENT_INPUT_CLASS, "text", this.placeholder, 'hidden' ]);

        // construct elements
        this.formDiv.appendChild(labelDiv);
        this.formDiv.appendChild(this.inputDiv);
        this.inputDiv.appendChild(this.input);
    }

    /**
     * Adds event listeners to the input
     */
    createListeners() {
        this.input.oninput = this.action;
    }

}
export default LabeledTextSidebarInput;