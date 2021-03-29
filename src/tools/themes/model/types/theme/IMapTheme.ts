import IMapDomain from "../../../../../model/types/domain/IMapDomain";

/**
 * This interface declares a map theme API.
 * 
 * @author Jiri Hynek
 */
interface IMapTheme extends IMapDomain {

    /**
     * It returns the url of the preferred base map.
     */
    getBaseMap(): string;

    /**
     * It returns if the styles preferres inversed dark colors.
     */
    isDark(): boolean;

    // TODO define themes interface
    
}
export default IMapTheme;