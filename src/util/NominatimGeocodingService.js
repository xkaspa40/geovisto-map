/**
 * Provides requests for [lat, lng] based on city name.
 *
 * @author Petr Kaspar
 */
class NominatimGeocodingService {
    constructor() {
        //stores already fetched 'from' => [lat, lng] so we don't request locations we already got in the past requests
        this.geoCodingMap = {};
    }

    /**
     * Do not call this function directly. Use getLatLng (which provides some basic caching) instead.
     *
     * @param from
     * @returns {Promise<any>}
     */
    async fetchFromApi(from) {
        from = encodeURIComponent(from);
        const response = await fetch(`https://nominatim.openstreetmap.org/search.php?q=${from}&format=json`);


        return await response.json();
    }

    /**
     * The callee of this function MUST provide a timer if bulk encoding in a loop is happening.
     * Use 1s intervals as an absolute minimum! Preferably higher, somewhere around 2 seconds.
     *
     * For more detail about usage of this API see https://operations.osmfoundation.org/policies/nominatim/
     *
     * @param from
     * @returns {Promise<*>}
     */
    async getLatLng(from) {
        if (this.geoCodingMap.from) {
            console.log('already have');
            return this.geoCodingMap.from;
        }

        const result = await this.fetchFromApi(from);
        this.geoCodingMap.from = [result[0].lat, result[0].lon];
        return this.geoCodingMap.from;
    }

} export default NominatimGeocodingService;