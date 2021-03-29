import IMapDimension from "../../types/dimension/IMapDimension";
import AbstractMapDomain from "../domain/abstract/AbstractMapDomain";
import IMapDomainManager from "../../types/domain/IMapDomainManager";
import IMapDomain from "../../types/domain/IMapDomain";

/**
 * The class wraps a map dimension and its properties.
 * 
 * @author Jiri Hynek
 */
class MapDimension<T extends IMapDomain> extends AbstractMapDomain implements IMapDimension<T> {
    
    private name: string;
    private domainManager: IMapDomainManager<T>;
    private domain: T | undefined;

    /**
     * It creates a new map dimension.
     * 
     * @param name 
     * @param dataDomain 
     */
    public constructor(name: string, domainManager: IMapDomainManager<T>, dataDomain: T | undefined) {
        super();
        this.name = name;
        this.domainManager = domainManager;
        this.domain = dataDomain;
    }

    /**
     * It returns the name of the dimension
     */
    public getName(): string {
        return this.name;
    }

    /**
     * It sets the name of the dimension
     */
    public setName(): void {
        this.name = name;
    }

    /**
     * It returns the map domain manager which is set to the map dimension.
     */
    public getDomainManager(): IMapDomainManager<T> {
        return this.domainManager;
    }

    /**
     * It sets a map domain manager which is set to the map dimension.
     * 
     * @param domainManager 
     */
    public setDomainManager(domainManager: IMapDomainManager<T>): void {
        this.domainManager = domainManager;
    }

    /**
     * It returns the map domain which is set to the map dimension.
     */
    public getDomain(): T | undefined {
        return this.domain;
    }

    /**
     * It sets a map domain which is set to the map dimension.
     * 
     * @param domain 
     */
    public setDomain(domain: T | undefined): void {
        this.domain = domain;
    }
}
export default MapDimension;