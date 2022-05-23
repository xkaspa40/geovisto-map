import AbstractSidebarInput from "../AbstractSidebarInput";
import TabDOMUtil from "../../util/TabDOMUtil";

const ID = 'geovisto-input-checkbox';

const COMPONENT_DIV_LABEL_CLASS = ID + '-label';

const COMPONENT_INPUT_TYPE = "checkbox";

class CheckboxSidebarInput extends AbstractSidebarInput {
    constructor(settings) {
        super(settings);

        this.label = settings.label;
        this.checked = settings.checked;
    }

    /**
     * Static function returns identifier of the input type.
     */
    static ID() {
        return ID;
    }

    create() {
        //create checkbox
        this.createForm();

        //create listeners
        this.createListeners();

        return this.formDiv;
    }

    createForm() {
        this.formDiv = document.createElement('div');
        this.formDiv.classList.add(ID);

        // label div
        let labelDiv = document.createElement('div');
        labelDiv.classList.add(COMPONENT_DIV_LABEL_CLASS);
        labelDiv.innerHTML = this.label;

        this.input = document.createElement('input');
        this.input.type = COMPONENT_INPUT_TYPE;
        this.input.checked = this.checked;
        this.formDiv.appendChild(this.input);
        this.formDiv.appendChild(labelDiv);
    }

    createListeners() {
        this.input.onclick = this.action;
    }


} export default CheckboxSidebarInput;