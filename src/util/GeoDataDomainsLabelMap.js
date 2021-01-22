import AbstractGeoDataDomain from "../model/data/AbstractMapDataDomain";

/**
 * Help class which provides mapping between GeoDataDomains and their labels.
 * 
 * @author Jiri Hynek
 */
class GeoDataDomainsLabelMap {

    /**
     * It initializes the map of the GeoDataDomains and its labels
     * 
     * @param {[AbstractGeoDataDomain]} dataDomains 
     */
    constructor(geoDataDomains) {
        this.map = {};

        for(let i = 0; i < geoDataDomains.length; i++) {
            this.map[geoDataDomains[i].toString()] = geoDataDomains[i];
        }
    }

    /**
     * It returns list of GeoDataDomains labels.
     */
    getLabels() {
        return Object.keys(this.map);
    }

    /**
     * It returns GeoDataDomain of the given label.
     * 
     * @param {string} label 
     */
    getGeoDataDomain(label) {
        return this.map[label];
    }
}
export default GeoDataDomainsLabelMap;