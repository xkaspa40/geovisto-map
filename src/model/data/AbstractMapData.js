import AbstractMapDataDomain from "./AbstractMapDataDomain";

/**
 * The class wraps data used by the map, its metadata and functions to acquire data items.
 * 
 * @author Jiri Hynek
 */
class AbstractMapData {

    /**
     * It initializes the data wrapper providing a basic API.
     * 
     * @param {any} data 
     */
    constructor(data) {
        this.data = data;
    }

    /**
     * It returns the original input data.
     */
    getOriginalData() {
        return this.data;
    }

    /**
     * It returns list of items of the type: AbstractMapDataDomain.
     * 
     * This function is intended to be overriden.
     * 
     * @returns {[AbstractMapDataDomain]}
     */
    getDataDomains() {
        return [];
    }

    /**
     * Help function which returns the list of data domain labels.
     * 
     * @param {string} label 
     */
    getDataDomainLabels() {
        let labels = [];
        let dataDomains = this.getDataDomains();
        for(let i = 0; i < dataDomains.length; i++) {
            labels.push(dataDomains[i].toString());
        }
        return labels;
    }

    /**
     * It returns the data domain which corresponds to the given string
     * or creates a new one.
     * 
     * @param {string} label 
     */
    getDataDomain(label) {
        return new AbstractMapDataDomain(label);
    }

    /**
     * It returns the preprocessed data as a list of items of the *same* [any] type.
     * 
     * This function is intended to be overriden.
     * 
     * @returns {[any]}
     */
    getData() {
        return [];
    }

    /**
     * It returns list of all values of the selected data domain.
     * 
     * @param {AbstractMapDataDomain} dataDomain 
     * @returns {[String]}
     */
    getValues(dataDomain) {
        return [];
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
        return [];
    }

    /**
     * It returns values stored in the given item of the selected data domain.
     * 
     * @param {AbstractMapDataDomain} dataDomain 
     * @param {any} item 
     * @returns {[String]}
     */
    getItemValues(dataDomain, item) {
        // if the data is not flattened, multiple values can be returned.
        // note that, currently, all of the Geovisto map tools works only with the valeus[0].
        // -> **the data should be flattened**
        return [];
    }
}
export default AbstractMapData;