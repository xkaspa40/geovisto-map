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
        if(this.div == undefined) {
            // create input element
            super.create();

            // create div block
            this.div = document.createElement("div");

            // append label
            if(this.label != undefined) {
                this.div.appendChild(document.createTextNode(this.label + ": "))
            }

            // append input element
            this.div.appendChild(this.input);
        }
        
        return this.div;
    }

}
export default LabeledTextSidebarInput;