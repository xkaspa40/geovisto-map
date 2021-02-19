import IMapObjectProps from "./IMapObjectProps";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
interface IMapObjectDefaults {

    /**
     * It returns default props if no props are given.
     */
    getProps(): IMapObjectProps;

    /**
     * It returns a unique type string of the tool.
     */
    getType(): string;

    /**
     * It returns identifier which is used when no identifier is specified.
     */
    getId(): string;
}
export default IMapObjectDefaults;