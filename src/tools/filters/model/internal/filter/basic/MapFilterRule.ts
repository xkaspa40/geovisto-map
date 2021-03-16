import IMapFilterRule from "../../../types/filter/IMapFilterRule";
import IMapDataDomain from "../../../../../../model/types/data/IMapDataDomain";
import IMapFilterOperation from "../../../types/filter/IMapFilterOperation";

/**
 * This class wraps dataDomain, filterOperation, pattern which represents a filter rule.
 * 
 * @author Jiri Hynek
 */
class MapFilterRule implements IMapFilterRule {
    
    private dataDomain: IMapDataDomain;
    
    private operation: IMapFilterOperation;
    
    private pattern: any;

    /**
     * It creates a filter rule composed of given data domain, operation and pattern.
     * 
     * @param dataDomain 
     * @param operation 
     * @param pattern 
     */
    public constructor(dataDomain: IMapDataDomain, operation: IMapFilterOperation, pattern: any) {
        this.dataDomain = dataDomain;
        this.operation = operation;
        this.pattern = pattern;
    }

    /**
     * It returns the the data domain which should be analyzed.
     */
    public getDataDomain(): IMapDataDomain {
        return this.dataDomain;
    }

    /**
     * It returns the filter operation used for the filtering.
     */
    public getFilterOperation(): IMapFilterOperation {
        return this.operation;
    }

    /**
     * It returns the string label of the filter representing operator given by the parameter of constructor.
     */
    public getPattern(): any {
        return this.pattern;
    }
}
export default MapFilterRule;