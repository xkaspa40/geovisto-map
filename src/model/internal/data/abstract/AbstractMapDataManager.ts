import IMapDataDomain from "../../../types/data/IMapDataDomain";
import IMapDataManager from "../../../types/data/IMapDataManager";

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
     * @param data 
     */
    constructor(data: any) {
        this.data = data;
    }

    /**
     * It returns the original input data.
     */
    public getOriginalData(): any {
        return this.data;
    }

    /**
     * It returns the preprocessed data as a list of data reconds of the *same* object type.
     */
    public abstract getDataRecords(): any[];

    /**
     * It returns list of data domains.
     */
    public abstract getDataDomains(): IMapDataDomain[];

    /**
     * It returns list of all values of the selected data domain.
     * 
     * @param dataDomain
     */
    public abstract getValues(dataDomain: IMapDataDomain): string[];

    /**
     * Help function which returns the list of data domain string name.
     */
    public getDataDomainNames(): string[] {
        const names = [];
        const dataDomains: IMapDataDomain[] = this.getDataDomains();
        for(let i = 0; i < dataDomains.length; i++) {
            names.push(dataDomains[i].getName());
        }
        return names;
    }

    /**
     * It returns the data domain which corresponds to the given string
     * or creates a new one.
     * 
     * @param name 
     */
    public getDataDomain(name : string) : IMapDataDomain | undefined {
        const dataDomains: IMapDataDomain[] = this.getDataDomains();
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
     * @param dataDomain
     * @param dataRecords
     */
    public abstract getDataRecordsValues(dataDomain: IMapDataDomain, data: any[]): string[];

    /**
     * It returns values stored of the selected data domain stored in the given data record.
     * 
     * @param dataDomain
     * @param dataRecord
     */
    public abstract getDataRecordValues(dataDomain: IMapDataDomain, dataRecord: any): string[];
}
export default AbstractMapDataManager;