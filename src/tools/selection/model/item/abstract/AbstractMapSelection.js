/**
 * The class provides API for the selection of map elements.
 * 
 * The selection can affect multiple geographical items identified by some id (e.g., ISO 3166-1 alpha-3 - CZE, SVK, ...).
 * 
 * @author Jiri Hynek
 */
class AbstractMapSelection {

    constructor() {
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
        return undefined;
    }

    /**
     * It returns identifiers of geographical items which were selected or affected by this selection.
     */
    getIds() {
        return undefined;
    }

    /**
     * It compares two selections.
     * 
     * @param {AbstractSelection} selection 
     */
    equals(selection) {
        return false;
    }

    /**
     * It adds geographical items.
     * 
     * @param {*} ids 
     */
    addIds(ids) {
        return undefined;
    }
}
export default AbstractMapSelection;