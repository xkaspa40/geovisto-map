import AbstractSidebarInput from '../AbstractSidebarInput';

const ID = 'geovisto-input-checkbox';

/**
 * This class represents basic checkbox sidebar input.
 *
 * @author Krystof Rykala
 */
class CheckboxSidebarInput extends AbstractSidebarInput {
    constructor(settings) {
        super(settings);
        this.label = settings.label;
        this.elementWrapper = undefined;
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
        this.elementWrapper = document.createElement('div');
        this.elementWrapper.setAttribute('class', ID);

        const labelElement = this.createLabel();
        this.input = this.createCheckbox();

        this.elementWrapper.appendChild(labelElement);
        this.elementWrapper.appendChild(this.input);

        return this.elementWrapper;
    }

    createLabel() {
        const labelElement = document.createElement('div');
        labelElement.innerHTML = this.label;
        labelElement.setAttribute("class", `${ID}-label`);
        return labelElement;
    }

    createCheckbox() {
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.onchange = this.action;
        input.name = this.name;
        return input;
    }

    getValue() {
        return this.input.checked;
    }

    setValue(checked) {
        this.input.checked = checked;
    }
}

export default CheckboxSidebarInput;
