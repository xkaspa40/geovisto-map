import rfdc from 'rfdc';
import FlattenedMapDataDomain from './JsonMapDataDomain';
import IMapDataDomain from '../../../types/data/IMapDataDomain';
import JsonMapDataDomain from './JsonMapDataDomain';
import AbstractMapDataManager from '../abstract/AbstractMapDataManager';
import IMapDataManager from '../../../types/data/IMapDataManager';

/**
 * A data wrapper which provides a basic flattening of JSON data structure.
 * 
 * @author Jiri Hynek
 */
class JsonMapDataManager extends AbstractMapDataManager implements IMapDataManager {
    
    /**
     * The list is initialized when required.
     */
    private dataRecords: any[];

    /**
     * The list is initialized when required.
     */
    private dataDomains: IMapDataDomain[];

    /**
     * It creates JSON data manager
     * 
     * @param data 
     */
    constructor(data: any) {
        super(data);
        this.dataRecords = [];
        this.dataDomains = [];
    }

    /**
     * It returns the original input data.
     */
    public getOriginalData(): any {
        return super.getOriginalData();
    }

    /**
     * It returns preprocessed flattened data.
     */
    public getDataRecords(): any[] {
        if(this.dataRecords == undefined) {
            this.dataRecords = this.createDataRecords(this.getOriginalData());
        }
        return this.dataRecords;
    }

    /**
     * It returns list of data domains (IMapDataDomain) representing data dimensions e. g.:
     * [
     *   [ 'value' ],
     *   [ 'source', 'ip' ],
     *   [ 'source', 'country' ],
     *   [ 'target', 'ip' ],
     *   [ 'target', 'country' ]
     * ]
     * 
     */
    public getDataDomains(): IMapDataDomain[] {
        if(this.dataDomains == undefined) {
            this.dataDomains = this.createDataDomains();
        }

        return this.dataDomains;
    }

    /**
     * It returns the data domain which corresponds to the given string.
     * 
     * If data domain does not exists it creates a new one (to avoid undefined return value)
     * 
     * @param name 
     */
    public getDataDomain(name: string): IMapDataDomain {
        const dataDomain: IMapDataDomain | undefined = super.getDataDomain(name);
        return dataDomain ? dataDomain : new JsonMapDataDomain(name.split('.'));
    }

    /**
     * It returns list of all values of the selected data domain.
     * 
     * @param dataDomain
     */
    public getValues(dataDomain: IMapDataDomain): string[] {
        return this.getDataRecordsValues(dataDomain, this.getDataRecords());
    }

    /**
     * It returns list of all values of the selected data domain
     * for the given subset of data.
     * 
     * @param dataDomain 
     * @param dataRecords 
     */
    public getDataRecordsValues(dataDomain: IMapDataDomain, dataRecords: any[]): string[] {
        const result: string[] = [];

        if(dataRecords != undefined) {
            for(let i = 0; i < dataRecords.length; i++) {
                const actResult: string[] = [];
                this.processDataDomainDescription(actResult, dataRecords[i], dataDomain.getOriginal(), 0);
                // add only unique results
                for(let j = 0; j < actResult.length; j++) {
                    if(!result.includes(actResult[j])) {
                        result.push(actResult[j]);
                    }
                }
            }
        }

        return result;
    }

    /**
     * It returns values stored of the selected data domain stored in the given data record.
     * 
     * @param dataDomain
     * @param dataRecord
     */
    public getDataRecordValues(dataDomain: IMapDataDomain, dataRecord: any): string[] {
        const result: string[] = [];

        if(dataRecord != undefined) {
            this.processDataDomainDescription(result, dataRecord, dataDomain.getOriginal(), 0);
        }

        return result;
    }

    /**
     * Help function which analyzes data and creates its metedata description.
     */
    protected createDataDomains(): IMapDataDomain[] {
        /*
         * Tests if an array contains an item
         */
        const contains = function(dataDomains: IMapDataDomain[], dataDomain: IMapDataDomain) {
            const dataDomainLabel = dataDomain.getName();
            for(let i = 0; i < dataDomains.length; i++) {
                if(dataDomains[i].getName() == dataDomainLabel) {
                    return true;
                }
            }
            return false;
        };

        /*
         * *Recursive* build of data domains
         *
         * TODO: optimize
         */
        const processDataDomain = function(dataDomains: IMapDataDomain[], dataDomainValues: any[], actValue: any) {
            if(typeof actValue == "object") {
                // object
                if(Array.isArray(actValue)) {
                    // array - in the case that the data are not flattened
                    dataDomainValues.push("[]");
                    for(let i = 0; i < actValue.length; i++) {
                        processDataDomain(dataDomains, dataDomainValues, actValue[i]);
                    }
                } else {
                    // structure (key, value)
                    const actKeys: string[] = Object.keys(actValue);
                    for(let j = 0; j < actKeys.length; j++) {
                        const dataDomainCopy = [...dataDomainValues];
                        dataDomainCopy.push(actKeys[j]);
                        processDataDomain(dataDomains, dataDomainCopy, actValue[actKeys[j]]);
                    }
                }
            } else {
                // simple value
                const newMapDataDomain = new FlattenedMapDataDomain(dataDomainValues);
                if(!contains(dataDomains, newMapDataDomain)) {
                    dataDomains.push(newMapDataDomain);
                }
            }
        };

        // process data -> builing list of data domains (simplified scheme)
        const dataDomains: IMapDataDomain[] = [];
        let dataDomainValues: any[] = [];
        let actKeys;
        const data: any[] = this.getDataRecords(); // get flattened data
        for (let i = 0; i < data.length; i++) {
            actKeys = Object.keys(data[i]);
            for(let j = 0; j < actKeys.length; j++) {
                dataDomainValues = [ actKeys[j] ];
                processDataDomain(dataDomains, dataDomainValues, data[i][actKeys[j]]);
            }
        }
        console.log("data domains:", dataDomains);

        return dataDomains;
    }

    /**
     * Help function which converts data to the flat structure.
     * 
     * TODO: rewrite to typescript
     */
    protected createDataRecords(data: any): any[] { 

        /*
         * *Recursive* flattening of data
         *
         * TODO: optimize
         */
        const transformObject = function(actValue: any): any[] | null {
            let result: any[] | null;
            const clone = rfdc;
            if(typeof actValue == "object") {
                // object
                if(Array.isArray(actValue)) {
                    // array
                    let transformedChildren: any[] = [];
                    let transformedChild: any[] | null;
                    for(let i = 0; i < actValue.length; i++) {
                        transformedChild = transformObject(actValue[i]);
                        if(Array.isArray(transformedChild)) {
                            transformedChildren = transformedChildren.concat(transformedChild);
                        } else if (transformedChild != null) {
                            transformedChildren.push(transformedChild);
                        }
                    }
                    result = transformedChildren;
                } else {
                    // structure (key, value)
                    let transformedChild: any[] | null;
                    const actKeys: string[] = Object.keys(actValue);
                    result = [{}];
                    for(let i = 0; i < actKeys.length; i++) {
                        transformedChild = transformObject(actValue[actKeys[i]]);
                        if(Array.isArray(transformedChild)) {
                            // wee need to duplicate actual results
                            const newResults: any[] = [];
                            let copy: any;
                            for(let j = 0; j < result.length; j++) {
                                for(let k = 0; k < transformedChild.length; k++) {
                                    copy = clone(result[j]);
                                    copy[actKeys[i]] = transformedChild[k];
                                    newResults.push(copy);
                                }
                            }
                            result = newResults;
                        } else if (transformedChild != null) {
                            for(let j = 0; j < result.length; j++) {
                                result[j][actKeys[i]] = transformedChild;
                            }
                        }
                    }
                }

                // optimization
                if(result.length == 0) {
                    result = null;
                } else if(result.length == 1) {
                    result = result[0];
                }
            } else {
                 result = actValue;
            }
            return result;
        };
        
        const result: any[] | null = transformObject(data);
        const dataRecords = result != null ? result : [];
        console.log("flattened data: ", dataRecords);

        return dataRecords;
    }

    /**
     * Static help function represenets a step of recursive data processing searching data items.7
     * 
     * TODO: rewrite to typescript
     * 
     * @param result 
     * @param actValue 
     * @param dataDomain 
     * @param i 
     */
    protected processDataDomainDescription(result: string[], actValue: any, domainDescription: any, i: number): void {

        if(actValue != undefined && actValue != null) {
            if(i == domainDescription.length) {
                // reached the value
                if(typeof actValue != "object") {
                    result.push(actValue);
                }
            } else {
                // act value needs to be type of object
                // TODO reqrite to TypeScript
                if(typeof actValue == "object") {
                    const dataDomainPart = domainDescription[i];
                    if(dataDomainPart == "[]") {
                        // act value needs to be type of array
                        if(Array.isArray(actValue)) {
                            for(let j = 0; j < actValue.length; j++) {
                                this.processDataDomainDescription(result, actValue[j], domainDescription, i+1);
                            }
                        }
                    } else {
                        // act value is structure
                        this.processDataDomainDescription(result, actValue[dataDomainPart], domainDescription, i+1);
                    }
                }
            }
        }
    }
}
export default JsonMapDataManager;
