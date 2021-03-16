import MapCategoriesManager from "../../../../../../model/internal/category/generic/MapCategoriesManager";
import IMapFiltersManager from "../../../types/filter/IMapFilterManager";
import IMapFilterOperation from "../../../types/filter/IMapFilterOperation";
import IMapFilterRule from "../../../types/filter/IMapFilterRule";
import IMapDataDomain from "../../../../../../model/types/data/IMapDataDomain";
import MapFilterRule from "./MapFilterRule";
import IMapDataManager from "../../../../../../model/types/data/IMapDataManager";

/**
 * This class provide functions for using filters.
 * 
 * @author Jiri Hynek
 */
class MapFiltersManager extends MapCategoriesManager<IMapFilterOperation> implements IMapFiltersManager {

    public constructor(filterOperations: IMapFilterOperation[]) {
        super(filterOperations);
    }

    /**
     * The function creates a new filter rule using given operation label.
     * If operation does not exists it returns null.
     * 
     * @param dataDomain 
     * @param label 
     * @param pattern 
     */
    public createRule(dataDomain: IMapDataDomain, opName: string, pattern: any): IMapFilterRule | null {
        const operation: IMapFilterOperation[] = this.getByName(opName);
        if(operation.length > 0) {
            return new MapFilterRule(dataDomain, operation[0], pattern);
        } 
        return null;
    }

    /**
     * Takes a list of data and applies the given filter rules.
     * Returns a new list of the references to filtered data items.
     * 
     * TODO: define data records type
     * 
     * @param dataManager
     * @param dataRecords 
     * @param filterRules 
     */
    public filterData(dataManager: IMapDataManager, dataRecords: any[], filterRules: IMapFilterRule[]): any[] {
        const resultData: any[] = [];

        // prepare arrays to save computation time
        const dataDomains: IMapDataDomain[] = [];
        const matchFunctions: ((value: any, pattern: any) => boolean)[] = [];
        const patterns: string[] = [];
        for(let i = 0; i < filterRules.length; i++) {
            dataDomains.push(filterRules[i].getDataDomain());
            matchFunctions.push(filterRules[i].getFilterOperation().match);
            patterns.push(filterRules[i].getPattern());
        }

        // go through data
        let doFilter: boolean;
        let values: string[];
        for(let i = 0; i < dataRecords.length; i++) {
            doFilter = false;
            for(let j = 0; j < filterRules.length; j++) {
                values = dataManager.getDataRecordsValues(dataDomains[j], dataRecords[i]);
                if(values.length == 1) {
                    if(!matchFunctions[j](values[0], patterns[j])) {
                        doFilter = true;
                        break;
                    }
                }
            }
            if(!doFilter) {
                // data item is accepted by all filter rules
                resultData.push(dataRecords[i]);
            }
        }

        return resultData;
    }
}
export default MapFiltersManager;