import SelectSidebarInput from "./SelectSidebarInput";

const ID = "geovisto-input-select-labeled";

/**
 * This class represents basic select sidebar input composed of options.
 * 
 * @author Jiri Hynek
 */
class LabeledSelectSidebarInput extends SelectSidebarInput {

    constructor(settings) {
        super(settings);
        this.label = settings.label;
        this.div = undefined;
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
        if(this.div == undefined) {
            // create select element
            super.create();

            // create div block
            this.div = document.createElement("div");

            // append label
            if(this.label != undefined) {
                this.div.appendChild(document.createTextNode(this.label + ": "))
            }

            // append select element
            this.div.appendChild(this.element);
        }
        
        return this.div;
    }
}
export default LabeledSelectSidebarInput;