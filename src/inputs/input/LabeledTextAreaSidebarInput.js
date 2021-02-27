import AbstractSidebarInput from '../AbstractSidebarInput';

const ID = 'geovisto-input-text-area-labeled';

/**
 * This class represents basic text sidebar input.
 *
 * @author Andrej Tlcina
 */
class LabeledTextAreaSidebarInput extends AbstractSidebarInput {
  constructor(settings) {
    super(settings);
    this.label = settings.label;
    this.value = settings.value;
    this.div = undefined;
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
    if (this.div == undefined) {
      this.input = document.createElement('textarea');
      // create div block
      this.div = document.createElement('div');
      // append label
      if (this.label != undefined) {
        this.div.appendChild(document.createTextNode(this.label + ': '));
      }

      if (this.value) {
        this.input.value = this.value;
      }

      // append input element
      this.div.appendChild(this.input);

      this.input.onchange = this.action;
    }
    return this.div;
  }

  /**
   * It returns value of the input element.
   */
  getValue() {
    return this.input.value;
  }

  /**
   * It sets value of the input element.
   *
   * @param {*} value
   */
  setValue(value) {
    this.input.value = value;
  }
}
export default LabeledTextAreaSidebarInput;
