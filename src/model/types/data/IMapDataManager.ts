import IMapDataDomain from "./IMapDataDomain";

/**
 * The interface declares data used by the map, its metadata and functions to acquire data items.
 * 
 * @author Jiri Hynek
 */
interface IMapDataManager {

    /**
     * It returns the original input data.
     */
    getOriginalData(): any;

    /**
     * It returns the preprocessed data as a list of data reconds of the *same* object type.
     */
    getDataRecords(): object[];

    /**
     * It returns list of all values of the selected data domain.
     * 
     * @param {IMapDataDomain} dataDomain
     */
    getValues(dataDomain: IMapDataDomain): string[];

    /**
     * It returns list of data domains.
     */
    getDataDomains(): IMapDataDomain[];

    /**
     * Help function which returns the list of data domain names. 
     */
    getDataDomainNames(): string[];

    /**
     * It returns the data domain which corresponds to the given string
     * or creates a new one.
     * 
     * @param {string} label 
     */
    getDataDomain(label: string): IMapDataDomain | undefined;

    /**
     * It returns list of all values of the selected data domain stored in the given data records.
     * 
     * @param {IMapDataDomain} dataDomain
     * @param {object[]} dataRecords
     */
    getDataRecordsValues(dataDomain: IMapDataDomain, dataRecords: object[]): string[];

    /**
     * It returns values stored of the selected data domain stored in the given data record.
     * 
     * @param {IMapDataDomain} dataDomain
     * @param {object} dataRecord
     */
    getDataRecordValues(dataDomain: IMapDataDomain, dataRecord: object): string[];
}
export default IMapDataManager;