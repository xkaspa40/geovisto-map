import IMapTool from "../../../../../model/types/tool/IMapTool";
import IMapSelection from "../../types/selection/IMapSelection";

/**
 * The class provides API for the selection of map elements.
 * It wraps reference to the source element and list of identifiers of geographic items.
 * 
 * @author Jiri Hynek
 */
class MapSelection implements IMapSelection {
    
    private tool: IMapTool;
    private srcIds: string[];
    private allIds: string[];

    /**
     * It creates a map selection.
     * 
     * @param tool 
     * @param srcIds 
     */
    public constructor(tool: IMapTool, srcIds: string[]) {
        this.tool = tool;
        this.srcIds = srcIds;
        this.allIds = srcIds.map((x) => x);
    }

    /**
     * It returns the tool of the selected element.
     */
    public getTool(): IMapTool {
        return this.tool;
    }

    /**
     * It returns identifiers of geographical items which were selected.
     */
    public getSrcIds(): string[] {
        return this.srcIds;
    }

    /**
     * It returns identifiers of geographical items which were selected or affected by this selection.
     */
    public getIds(): string[] {
        return this.allIds;
    }

    /**
     * It compares two map selections.
     * 
     * @param selection 
     */
    public equals(selection: IMapSelection): boolean {
        if(selection) {
            const srcIds: string[] = this.getSrcIds();
            const srcIds2: string[] = selection.getSrcIds();
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
     * It takes geographical items and returns the list of new ids
     * which were added to the list of all ids.
     * 
     * @param ids 
     */
    public addIds(ids: string[]): string[] {
        const newIds: string[] = [];
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