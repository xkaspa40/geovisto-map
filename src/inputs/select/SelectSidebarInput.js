import AbstractSidebarInput from '../input/TextSidebarInput';

const ID = 'geovisto-input-select';

/**
 * This class represents basic select sidebar input composed of options.
 *
 * @author Jiri Hynek
 */
class SelectSidebarInput extends AbstractSidebarInput {
  constructor(settings) {
    super(settings);
    this.options = settings.options;
    this.value = settings.value;
  }

  /**
   * Static function returns identifier of the input type
   */
  static ID() {
    return ID;
  }

  /**
   * It returns select element.
   */
  create() {
    if (this.element == undefined) {
      // create select element
      this.element = document.createElement('select');
      this.element.onchange = this.action;
      // append options
      let option;
      for (let i = 0; i < this.options.length; i++) {
        option = this.element.appendChild(document.createElement('option'));
        if (typeof this.options[i] === 'object' && this.options[i] !== null) {
          option.setAttribute('value', this.options[i].value);
          option.innerHTML = this.options[i].label;
          option.selected = Boolean(this.options[i].selected);
        } else {
          option.setAttribute('value', this.options[i]);
          option.innerHTML = this.options[i];
        }
      }
      if (this.value) this.element.value = this.value;
    }
    return this.element;
  }

  /*
   * Sets/removes attribute 'disabled' from input box.
   */
  setDisabled(disabled) {
    if (this.element === undefined) return;
    if (disabled == true) {
      this.element.setAttribute('disabled', true);
    }
    if (disabled == false) {
      this.element.removeAttribute('disabled');
    }
  }

  /**
   * It returns value of the select element.
   */
  getValue() {
    return this.element.value;
  }

  /**
   * It sets value of the select element.
   *
   * @param {*} value
   */
  setValue(value) {
    this.element.value = value;
  }
}
export default SelectSidebarInput;
