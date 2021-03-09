import IMapTool from "../../../../../model/types/tool/IMapTool";

/**
 * The interface declares API for the selection of map elements.
 * 
 * The selection can affect multiple geographical items identified by some id (e.g., ISO 3166-1 alpha-3 - CZE, SVK, ...).
 * 
 * @author Jiri Hynek
 */
interface IMapSelection {

    /**
     * It returns the tool of the selected element.
     */
    getTool(): IMapTool;

    /**
     * It returns identifiers of geographical items which were selected.
     */
    getSrcIds(): string[];

    /**
     * It returns identifiers of geographical items which were selected or affected by this selection.
     */
    getIds(): string[];

    /**
     * It compares two selections.
     * 
     * @param {IMapSelection} selection 
     */
    equals(selection: IMapSelection): boolean;

    /**
     * It adds geographical items.
     * 
     * @param {string[]} ids 
     */
    addIds(ids: string[]): void;
}
export default IMapSelection;