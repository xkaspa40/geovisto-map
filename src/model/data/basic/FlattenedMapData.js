import rfdc from 'rfdc';
import FlattenedMapDataDomain from './FlattenedMapDataDomain';
import AbstractMapData from '../abstract/AbstractMapData';

/**
 * Example of a data wrapper which provides a basic flattening.
 * 
 * @author Jiri Hynek
 */
class FlattenedMapData extends AbstractMapData {

    constructor(data) {
        super(data);
        this.flattenedData = undefined;
        this.dataDomains = undefined;
    }

    /**
     * It returns the original input data.
     */
    getOriginalData() {
        return super.getOriginalData();
    }

    /**
     * It returns list of data domains (FlattenedMapDataDomain) representing data dimensions e. g.:
     * [
     *   [ 'value' ],
     *   [ 'source', 'ip' ],
     *   [ 'source', 'country' ],
     *   [ 'target', 'ip' ],
     *   [ 'target', 'country' ]
     * ]
     * 
     */
    getDataDomains() {
        if(this.dataDomains == undefined) {
            this.createDataDomains();
        }

        return this.dataDomains;
    }

    /**
     * It returns the data domain which corresponds to the given string.
     * 
     * @param {string} label 
     */
    getDataDomain(label) {
        let dataDomains = this.getDataDomains();
        for(let i = 0; i < dataDomains.size; i++) {
            if(dataDomains[i].toString == label) {
                return dataDomains[i];
            }
        }
        return new FlattenedMapDataDomain(label.split('.'));
    }

    /**
     * It returns preprocessed flattened data.
     */
    getData() {
        if(this.flattenedData == undefined) {
            this.flattenArrays();
        }
        return this.flattenedData;
    }

    /**
     * It returns list of all values of the selected data domain.
     * 
     * @param {AbstractMapDataDomain} dataDomain 
     * @returns {[String]}
     */
    getValues(dataDomain) {
        return this.getDataValues(dataDomain, this.getData());
    }

    /**
     * It returns list of all values of the selected data domain
     * for the given subset of data.
     * 
     * @param {AbstractMapDataDomain} dataDomain 
     * @param {any} data 
     * @returns {[String]}
     */
    getDataValues(dataDomain, data) {
        let result = [];

        if(data != undefined) {
            for(let i = 0; i < data.length; i++) {
                let actResult = [];
                FlattenedMapData.processDataDomainDescription(actResult, data[i], dataDomain.getDomainDescription(), 0);
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
     * It returns values stored in the given item of the selected data domain.
     * 
     * @param {AbstractMapDataDomain} dataDomain 
     * @param {any} item 
     * @returns {[String]}
     */
    getItemValues(dataDomain, item) {
        let result = [];

        if(item != undefined) {
            FlattenedMapData.processDataDomainDescription(result, item, dataDomain.getDomainDescription(), 0);
        }

        return result;
    }

    /**
     * Help function which analyzes data and creates its metedata description.
     */
    createDataDomains() {
        /*
         * Tests if an array contains an item
         */
        let contains = function(dataDomains, dataDomain) {
            let dataDomainLabel = dataDomain.toString()
            for(let i = 0; i < dataDomains.length; i++) {
                if(dataDomains[i].toString() == dataDomainLabel) {
                    return true;
                }
            }
            return false;
        }

        /*
         * *Recursive* build of data domains
         *
         * TODO: optimize
         */
        let processDataDomain = function(dataDomains, dataDomain, actValue) {
            if(typeof actValue == "object" && actValue != null) {
                // object
                if(Array.isArray(actValue)) {
                    // array - in the case that the data are not flattened
                    dataDomain.push("[]");
                    for(let i = 0; i < actValue.length; i++) {
                        processDataDomain(dataDomains, dataDomain, actValue[i]);
                    }
                } else {
                    // structure (key, value)
                    let actKeys = Object.keys(actValue);
                    for(let j = 0; j < actKeys.length; j++) {
                        let dataDomainCopy = [...dataDomain];
                        dataDomainCopy.push(actKeys[j]);
                        processDataDomain(dataDomains, dataDomainCopy, actValue[actKeys[j]]);
                    }
                }
            } else {
                // simple value
                let newMapDataDomain = new FlattenedMapDataDomain(dataDomain);
                if(!contains(dataDomains, newMapDataDomain)) {
                    dataDomains.push(newMapDataDomain);
                }
            }
        }

        // process data -> builing list of data domains (simplified scheme)
        this.dataDomains = [];
        let dataDomain;
        let actKeys;
        let data = this.getData(); // get flattened data
        for (var i = 0; i < data.length; i++) {
            actKeys = Object.keys(data[i]);
            for(let j = 0; j < actKeys.length; j++) {
                dataDomain = [ actKeys[j] ];
                processDataDomain(this.dataDomains, dataDomain, data[i][actKeys[j]]);
            }
        }
        console.log("data domains:", this.dataDomains);
    }

    /**
     * Help function which converts data to the flat structure.
     */
    flattenArrays() { 

        /*
         * *Recursive* flattening of data
         *
         * TODO: optimize
         */
        let transformObject = function(actValue) {
            let result;
            let clone = new rfdc();
            if(typeof actValue == "object") {
                // object
                if(Array.isArray(actValue)) {
                    // array
                    let transformedChildren = [];
                    let transformedChild;
                    for(let i = 0; i < actValue.length; i++) {
                        transformedChild = transformObject(actValue[i]);
                        if(Array.isArray(transformedChild)) {
                            transformedChildren = transformedChildren.concat(transformedChild);
                        } else {
                            transformedChildren.push(transformedChild);
                        }
                    }
                    result = transformedChildren;
                } else {
                    // structure (key, value)
                    let transformedChild;
                    let actKeys = Object.keys(actValue);
                    result = [{}];
                    for(let i = 0; i < actKeys.length; i++) {
                        transformedChild = transformObject(actValue[actKeys[i]]);
                        if(Array.isArray(transformedChild)) {
                            // wee need to duplicate actual results
                            let newResults = [];
                            let copy;
                            for(let j = 0; j < result.length; j++) {
                                for(let k = 0; k < transformedChild.length; k++) {
                                    copy = clone(result[j]);
                                    copy[actKeys[i]] = transformedChild[k];
                                    newResults.push(copy);
                                }
                            }
                            result = newResults;
                        } else {
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
        }
        
        this.flattenedData = transformObject(this.data);
        console.log("flattened data: ", this.data);
    }

    /**
     * Static help function represenets a step of recursive data processing searching data items.
     * 
     * @param {*} result 
     * @param {*} actValue 
     * @param {*} dataDomain 
     * @param {*} i 
     */
    static processDataDomainDescription(result, actValue, domainDescription, i) {

        if(actValue != undefined && actValue != null) {
            if(i == domainDescription.length) {
                // reached the value
                if(typeof actValue != "object") {
                    result.push(actValue);
                } else {
                    result.push(null);
                }
            } else {
                // act value needs to be type of object
                if(typeof actValue == "object") {
                    let dataDomainPart = domainDescription[i];
                    if(dataDomainPart == "[]") {
                        // act value needs to be type of array
                        if(Array.isArray(actValue)) {
                            for(let j = 0; j < actValue.length; j++) {
                                FlattenedMapData.processDataDomainDescription(result, actValue[j], domainDescription, i+1);
                            }
                        }
                    } else {
                        // act value is structure
                        FlattenedMapData.processDataDomainDescription(result, actValue[dataDomainPart], domainDescription, i+1);
                    }
                }
            }
        }
    }
}
export default FlattenedMapData
