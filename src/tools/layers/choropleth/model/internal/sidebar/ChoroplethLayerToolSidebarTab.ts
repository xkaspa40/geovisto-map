import ChoroplethLayerToolSidebarTabDefaults from "./ChoroplethLayerToolSidebarTabDefaults";
import IChoroplethLayerTool from "../../types/tool/IChoroplethLayerTool";
import { ILayerToolSidebarTabProps, AbstractLayerToolSidebarTab, ILayerToolSidebarTab, ILayerToolSidebarTabDefaults } from "../../../../../sidebar";
import IMapFormInput from "../../../../../../model/types/inputs/IMapFormInput";
import IMapDimension from "../../../../../../model/types/dimension/IMapDimension";
import IMapDataDomain from "../../../../../../model/types/data/IMapDataDomain";
import IChoroplethLayerToolDimensions from "../../types/tool/IChoroplethLayerToolDimensions";
import IMapAggregationFunction from "../../../../../../model/types/aggregation/IMapAggregationFunction";

/**
 * This class provides controls for management of the layer sidebar tab.
 * 
 * @author Jiri Hynek
 */
class ChoropolethLayerToolSidebarTab extends AbstractLayerToolSidebarTab<IChoroplethLayerTool> implements ILayerToolSidebarTab {
    
    private htmlContent: HTMLDivElement | undefined;
    
    private inputs: {
        geo: IMapFormInput;
        value: IMapFormInput;
        aggregation: IMapFormInput;
    } | undefined

    public constructor(tool: IChoroplethLayerTool, props: ILayerToolSidebarTabProps) {
        super(tool, props);
    }

    /**
     * It creates new defaults of the tab control.
     */
    public createDefaults(): ILayerToolSidebarTabDefaults {
        return new ChoroplethLayerToolSidebarTabDefaults(this);
    }

    /**
     * It updates selected input values according to the given data mapping.
     * 
     * @param dataMapping 
     */
    public setInputValues(dimensions: IChoroplethLayerToolDimensions): void {
        // update inputs
        this.inputs?.geo.setValue((dimensions.geo.getDomain()?.getName())?? "");
        this.inputs?.value.setValue((dimensions.value.getDomain()?.getName())?? "");
        this.inputs?.aggregation.setValue((dimensions.aggregation.getDomain()?.getName())?? "");
    }

    /**
     * It returns the sidebar tab pane.
     */
    public getContent(): HTMLDivElement {
        if(this.htmlContent == undefined) {
            // tab content
            this.htmlContent = document.createElement('div');
            const elem = this.htmlContent.appendChild(document.createElement('div'));
    
            // get data mapping model
            const dimensions: IChoroplethLayerToolDimensions = this.getTool().getState().getDimensions();

            // create inputs
            this.inputs = {
                geo: this.getInputGeo(dimensions.geo),
                value: this.getInputValue(dimensions.value),
                aggregation: this.getInputAggregation(dimensions.aggregation)
            };
            
            // append to DOM
            elem.appendChild(this.inputs.geo.create());        
            elem.appendChild(this.inputs.value.create());            
            elem.appendChild(this.inputs.aggregation.create());
    
            // set input values
            this.setInputValues(dimensions);
        }
        
        return this.htmlContent;
    }

    /**
     * It returns new input for the geo dimension.
     * 
     * @param dimension
     */
    public getInputGeo(dimension: IMapDimension<IMapDataDomain>): IMapFormInput {
        return this.getAutocompleteInput(dimension);
    }

    /**
     * It returns new input for the geo dimension.
     * 
     * @param dimension
     */
    public getInputValue(dimension: IMapDimension<IMapDataDomain>): IMapFormInput {
        return this.getAutocompleteInput(dimension);
    }

    /**
     * It returns new input for the geo dimension.
     * 
     * @param dimension
     */
    public getInputAggregation(dimension: IMapDimension<IMapAggregationFunction>): IMapFormInput {
        return this.getAutocompleteInput(dimension);
    }
}
export default ChoropolethLayerToolSidebarTab;