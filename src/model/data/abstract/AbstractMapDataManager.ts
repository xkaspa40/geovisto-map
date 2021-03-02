import IMapDataDomain from "./IMapDataDomain";
import IMapDataManager from "./IMapDataManager";

/**
 * The class wraps data used by the map, its metadata and functions to acquire data items.
 * 
 * @author Jiri Hynek
 */
abstract class AbstractMapDataManager implements IMapDataManager {
    
    private data: any;

    /**
     * It initializes the data wrapper providing a basic API.
     * 
     * @param {any} data 
     */
    constructor(data: any) {
        this.data = data;
    }

    /**
     * It returns the original input data.
     */
    getOriginalData() {
        return this.data;
    }

    /**
     * It returns the preprocessed data as a list of data reconds of the *same* object type.
     */
    abstract getDataRecords(): object[];

    /**
     * It returns list of data domains.
     */
    abstract getDataDomains(): IMapDataDomain[];

    /**
     * It returns list of all values of the selected data domain.
     * 
     * @param {IMapDataDomain} dataDomain
     */
    abstract getValues(dataDomain: IMapDataDomain): string[];

    /**
     * Help function which returns the list of data domain string name.
     */
    getDataDomainNames(): string[] {
        let names = [];
        let dataDomains: IMapDataDomain[] = this.getDataDomains();
        for(let i = 0; i < dataDomains.length; i++) {
            names.push(dataDomains[i].getName());
        }
        return names;
    }

    /**
     * It returns the data domain which corresponds to the given string
     * or creates a new one.
     * 
     * @param {string} name 
     */
    getDataDomain(name : string) : IMapDataDomain | undefined {
        let dataDomains: IMapDataDomain[] = this.getDataDomains();
        if(dataDomains != undefined) {
            for(let i = 0; i < dataDomains.length; i++) {
                if(dataDomains[i].getName() == name) {
                    return dataDomains[i];
                }
            }
        }
        return undefined;
    }

    /**
     * It returns list of all values of the selected data domain stored in the given data records.
     * 
     * @param {IMapDataDomain} dataDomain
     * @param {object[]} dataRecords
     */
    abstract getDataRecordsValues(dataDomain: IMapDataDomain, data: object[]): string[];

    /**
     * It returns values stored of the selected data domain stored in the given data record.
     * 
     * @param {IMapDataDomain} dataDomain
     * @param {object} dataRecord
     */
    abstract getDataRecordValues(dataDomain: IMapDataDomain, dataRecord: object): string[];
}
export default AbstractMapDataManager;