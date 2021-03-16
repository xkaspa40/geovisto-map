import MapToolState from "../../../../../model/internal/tool/MapToolState";
import IFiltersToolState from "../../types/tool/IFiltersToolState";
import IFiltersTool from "../../types/tool/IFiltersTool";
import IMapFilterRule from "../../types/filter/IMapFilterRule";
import IMapFiltersManager from "../../types/filter/IMapFilterManager";
import IFiltersToolConfig from "../../types/tool/IFiltersToolConfig";
import IFiltersToolProps from "../../types/tool/IFiltersToolProps";
import IFiltersToolDefaults from "../../types/tool/IFiltersToolDefaults";
import IMapDataDomain from "../../../../../model/types/data/IMapDataDomain";

/**
 * This class provide functions for using filters.
 * 
 * @author Jiri Hynek
 */
class FiltersToolState extends MapToolState implements IFiltersToolState {
    
    private rules: IMapFilterRule[];
    private manager: IMapFiltersManager;

    /**
     * It creates a tool state.
     * 
     * @param tool
     */
    public constructor(tool: IFiltersTool) {
        super(tool);

        const props: IFiltersToolProps = <IFiltersToolProps> this.getProps();
        const defaults: IFiltersToolDefaults = <IFiltersToolDefaults> this.getDefaults();

        // set filters manager - needs to be set before the filter rules
        this.manager = props.manager == undefined ? defaults.getFiltersManager() : props.manager;

        // set theme
        this.rules = props.rules == undefined ? defaults.getFilterRules() : props.rules;
    }

    /**
     * It resets state with respect to initial props.
     */
    public reset(): void {
        super.reset();

        const props: IFiltersToolProps = <IFiltersToolProps> this.getProps();
        const defaults: IFiltersToolDefaults = <IFiltersToolDefaults> this.getDefaults();

        // set filter manager, which manages filter operations
        this.setFiltersManager(props.manager == undefined ? defaults.getFiltersManager() : props.manager);

        // set filter rules if specified in props explicitly
        this.setFilterRules(props.rules == undefined ? defaults.getFilterRules() : props.rules);
    }

    /**
     * The metod takes config and deserializes the values.
     * 
     * @param config 
     */
    public deserialize(config: IFiltersToolConfig): void {
        super.deserialize(config);

        // deserialize filter rules
        if(config.filterRules) {
            // get filter and data manegers which are need for proper deserialization of filter rules
            const filterManager = this.getFiltersManager();
            const mapDataManager = this.getMap().getState().getMapData();
            if(filterManager != undefined && mapDataManager != undefined) {
                const filterRules: IMapFilterRule[] = [];
                let configFilterRule;
                let dataDomain: IMapDataDomain | undefined;
                let filterRule: IMapFilterRule | null;
                if(config.filterRules != undefined) {
                    for(let i = 0; i < config.filterRules.length; i++) {
                        configFilterRule = config.filterRules[i];
                        // get data domain
                        dataDomain = mapDataManager.getDataDomain(configFilterRule.domain);
                        if(dataDomain && configFilterRule.operation && configFilterRule.pattern) {
                            filterRule = filterManager.createRule(dataDomain, configFilterRule.operation, configFilterRule.pattern);
                            if(filterRule) {
                                filterRules.push();
                            }
                        }
                    }
                }
                this.setFilterRules(filterRules);
            }
        }
    }

    /**
     * The method serializes the tool state. Optionally, defaults can be set if property is undefined.
     * 
     * @param filterDefaults
     */
    public serialize(filterDefaults: boolean): IFiltersToolConfig {
        const config: IFiltersToolConfig = <IFiltersToolConfig> super.serialize(filterDefaults);

        // serialize filter filters
        if(this.rules != undefined) {
            config.filterRules = [];
            let filterRule;
            for(let i = 0; i < this.rules.length; i++) {
                filterRule = this.rules[i];
                config.filterRules.push({
                    domain: filterRule.getDataDomain().toString(),
                    operation: filterRule.getFilterOperation().toString(),
                    pattern: filterRule.getPattern()
                });
            }
        }

        return config;
    }

    /**
     * It returns filter manager
     */
    public getFiltersManager(): IMapFiltersManager {
        return this.manager;
    }

    /**
     * It updates filter manager.
     * 
     * @param manager
     */
    public setFiltersManager(manager: IMapFiltersManager): void {
        this.manager = manager;
    }

    /**
     * It returns the filterRules property of the tool state.
     */
    public getFilterRules(): IMapFilterRule[] {
        return this.rules;
    }

    /**
     * It sets the filterRules property of the tool state.
     * 
     * @param filterRules
     */
    public setFilterRules(filterRules: IMapFilterRule[]): void {
        this.rules = filterRules;
    }
}
export default FiltersToolState;