import AbstractMapSelection from "../abstract/AbstractMapSelection";

/**
 * The class provides API for the selection of map elements.
 * It wraps reference to the source element and list of identifiers of geographic items.
 * 
 * @author Jiri Hynek
 */
class MapSelection extends AbstractMapSelection {

    constructor(tool, srcIds) {
        super();
        this.tool = tool;
        this.srcIds = srcIds;
        this.allIds = srcIds.map((x) => x);
    }

    /**
     * It returns the source element of the selection.
     */
    getSrcElement() {
        return this.srcElement;
    }

    /**
     * It returns the tool of the selected element.
     */
    getTool() {
        return this.tool;
    }

    /**
     * It returns identifiers of geographical items which were selected.
     */
    getSrcIds() {
        return this.srcIds;
    }

    /**
     * It returns identifiers of geographical items which were selected or affected by this selection.
     */
    getIds() {
        return this.allIds;
    }

    /**
     * It compares two map selections.
     * 
     * @param selection 
     */
    equals(selection) {
        if(selection) {
            let srcIds = this.getSrcIds();
            let srcIds2 = selection.getSrcIds();
            if(this.getTool() == selection.getTool() && srcIds.length == srcIds2.length) {
                for (let i = 0; i < srcIds.length; i++) {
                    if(this.srcIds[i] != srcIds2[i]) {
                        return false;
                    }
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * It adds geographical items.
     * 
     * @param ids 
     */
    addIds(ids) {
        let newIds = [];
        for(let i = 0; i < ids.length; i++) {
            if(!this.allIds.includes(ids[i])) {
                this.allIds.push(ids[i]);
                newIds.push(ids[i]);
            }
        }
        return newIds;
    }
}
export default MapSelection;