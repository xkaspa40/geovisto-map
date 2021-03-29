import IMapDomain from "../domain/IMapDomain";
import IMapDomainManager from "../domain/IMapDomainManager";

/**
 * This interface declares functions for using a map dimension which allows to set a data domain.
 * 
 * @author Jiri Hynek
 */
interface IMapDimension<T extends IMapDomain> extends IMapDomain {

    /**
     * It sets the name of the dimension.
     */
    setName(): void;

    /**
     * It returns the map domain manager which provides options to the map dimension.
     */
    getDomainManager(): IMapDomainManager<T>;

    /**
     * It sets a map domain which provides options to the map dimension.
     * 
     * @param domain 
     */
    setDomainManager(domain: IMapDomainManager<T>): void;

    /**
     * It returns the map domain which is set to the map dimension.
     */
    getDomain(): T | undefined;

    /**
     * It sets a new map domain to the map dimension.
     * 
     * @param domain 
     */
    setDomain(domain: T | undefined): void;
}
export default IMapDimension;