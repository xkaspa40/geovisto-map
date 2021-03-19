import IMapDimension from "../../types/dimension/IMapDimension";
import AbstractMapCategory from "../category/abstract/AbstractMapCategory";
import IMapDataDomain from "../../types/data/IMapDataDomain";

/**
 * The class wraps a map dimension and its properties.
 * 
 * @author Jiri Hynek
 */
class MapDimension extends AbstractMapCategory implements IMapDimension {
    
    private name: string;
    private dataDomain: IMapDataDomain | undefined;

    /**
     * It creates a new map dimension.
     * 
     * @param name 
     * @param dataDomain 
     */
    public constructor(name: string, dataDomain: IMapDataDomain | undefined) {
        super();
        this.name = name;
        this.dataDomain = dataDomain;
    }

    /**
     * It return the name of the dimension
     */
    public getName(): string {
        return this.name;
    }

    /**
     * It returns the data domain which is set to the map dimension.
     */
    public getDataDomain(): IMapDataDomain | undefined {
        return this.dataDomain;
    }

    /**
     * It sets the data domain which is set to the map dimension.
     * 
     * @param dataDomain 
     */
    public setDataDomain(dataDomain: IMapDataDomain | undefined): void {
        this.dataDomain = dataDomain;
    }
}
export default MapDimension;