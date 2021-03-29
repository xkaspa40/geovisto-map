import IMapDataDomain from "./IMapDataDomain";
import IMapDomainManager from "../domain/IMapDomainManager";

/**
 * The interface declares map data domain manager which and data wrapper.
 * 
 * @author Jiri Hynek
 */
interface IMapDataManager extends IMapDomainManager<IMapDataDomain> {

    /**
     * It returns the original input data.
     */
    getOriginalData(): any;

    /**
     * It returns the preprocessed data as a list of data reconds of the *same* object type.
     */
    getDataRecords(): any[];

    /**
     * It returns list of all values of the selected data domain.
     * 
     * @param dataDomain
     */
    getValues(dataDomain: IMapDataDomain): string[];

    /**
     * It returns list of all values of the selected data domain stored in the given data records.
     * 
     * @param dataDomain
     * @param dataRecords
     */
    getDataRecordsValues(dataDomain: IMapDataDomain, dataRecords: any[]): string[];

    /**
     * It returns values stored of the selected data domain stored in the given data record.
     * 
     * @param dataDomain
     * @param dataRecord
     */
    getDataRecordValues(dataDomain: IMapDataDomain, dataRecord: any): string[];
}
export default IMapDataManager;