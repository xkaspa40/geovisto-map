import AbstractToolState from "../../model/tool/abstract/AbstractToolState";

/**
 * This class provide functions for using filters.
 *
 * @author Jiri Hynek
 */
class FiltersToolState extends AbstractToolState {

    /**
     * It creates a tool state.
     */
    constructor() {
        super();
    }

    /**
     * It resets state with respect to initial props. Optionally, defaults can be set if property
     * is undefined.
     *
     * @param {FiltersToolDefaults} defaults
     */
    reset(defaults) {
        super.reset(defaults);

        let props = this.getProps();

        // set filter manager, which manages filter operations
        this.setFiltersManager(props.manager == undefined && defaults ? defaults.getFiltersManager() : props.manager);

        // set filter rules if specified in props explicitly
        this.setFilterRules(props.rules == undefined && defaults ? defaults.getFilterRules() : props.rules);
    }

    /**
     * The metod takes config and desrializes the values.
     *
     * @param {*} config
     */
    deserialize(config) {
        super.deserialize(config);

        // deserialize filter rules
        if(config.filterRules != undefined) {
            // get filter and data manegers which are need for proper deserialization of filter rules
            let filterManager = this.getFiltersManager();
            let mapData = this.getMap().getState().getMapData();
            if(filterManager != undefined && mapData != undefined) {
                let filterRules = [];
                let configFilterRule;
                if(config.filterRules != undefined) {
                    for(let i = 0; i < config.filterRules.length; i++) {
                        configFilterRule = config.filterRules[i];

                        let dataDomain = mapData.getDataDomain(configFilterRule.domain);
                        let operation = filterManager.getOperation(configFilterRule.operation);

                        if(dataDomain != undefined && operation != undefined) {
                            filterRules.push(filterManager.createRule({
                                dataDomain,
                                label: operation,
                                pattern: configFilterRule.pattern
                            }));
                        }
                    }
                }
                this.setFilterRules(filterRules);
            }
        }
    }

    /**
     * The method serializes the tool state. Optionally, defaults can be set if property is
     * undefined.
     *
     * @param {FiltersToolDefaults} defaults
     */
    serialize(defaults) {
        let config = super.serialize(defaults);

        // serialize filter filters
        if(this.filterRules != undefined) {
            config.filterRules = [];
            let filterRule;
            for(let i = 0; i < this.filterRules.length; i++) {
                filterRule = this.filterRules[i];
                config.filterRules.push({
                    domain: filterRule.getDataDomain().toString(),
                    operation: filterRule.getFilterOperation().toString(),
                    pattern: filterRule.getPattern()
                })
            }
        }

        return config;
    }

    /**
     * It updates filter manager.
     *
     * @param {AbstractFiltersManager} manager
     */
    setFiltersManager(manager) {
        this.manager = manager;
    }

    /**
     * It returns filter manager
     */
    getFiltersManager() {
        return this.manager;
    }

    /**
     * It returns the filterRules property of the tool state.
     */
    getFilterRules() {
        return this.filterRules;
    }

    /**
     * It sets the filterRules property of the tool state.
     *
     * @param {[AbstractFilterRule]} filterRules
     */
    setFilterRules(filterRules) {
        this.filterRules = filterRules;
    }
}
export default FiltersToolState;
