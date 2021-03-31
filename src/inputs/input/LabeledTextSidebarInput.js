import TextSidebarInput from "./TextSidebarInput";

const ID = "geovisto-input-text-labeled";

/**
 * This class represents labeled text sidebar input.
 *
 * @author Jiri Hynek
 */
class LabeledTextSidebarInput extends TextSidebarInput {

    constructor(settings) {
        super(settings);
        this.label = settings.label;
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
            // create input element
            super.create();

            // create div block
            this.div = document.createElement("div");
            this.div.setAttribute("class", ID);


            // append label
            if (this.label != null) {
                this.div.appendChild(this.createLabel())
            }

            // append input element
            const inputWrapper = document.createElement("div");
            inputWrapper.setAttribute("class", `${ID}-component`);
            inputWrapper.appendChild(this.input);
            this.div.appendChild(inputWrapper);
        }

        return this.div;
    }

    createLabel() {
        const labelElement = document.createElement("div");
        labelElement.innerHTML = this.label;
        labelElement.setAttribute("class", `${ID}-label`);
        return labelElement;
    }
}

export default LabeledTextSidebarInput;
