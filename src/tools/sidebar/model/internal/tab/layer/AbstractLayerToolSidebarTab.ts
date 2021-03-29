import LayerToolSidebarTabDefaults from "./LayerToolSidebarTabDefaults";
import LayerToolSidebarTabState from "./LayerToolSidebarTabState";
import { AbstractSidebarTab } from "../../../..";
import ILayerTool from "../../../../../../model/types/layer/ILayerTool";
import ILayerToolSidebarTabProps from "../../../types/tab/layer/ILayerToolSidebarTabProps";
import ILayerToolSidebarTab from "../../../types/tab/layer/ILayerToolSidebarTab";
import ILayerToolSidebarTabDefaults from "../../../types/tab/layer/ILayerToolSidebarTabDefaults";
import ILayerToolSidebarTabState from "../../../types/tab/layer/ILayerToolSidebarTabState";
import IMapDimension from "../../../../../../model/types/dimension/IMapDimension";
import AutocompleteFormInput from "../../../../../../model/internal/inputs/labeled/autocomplete/AutocompleteFormInput";
import IMapDomain from "../../../../../../model/types/domain/IMapDomain";
import IMapFormInput from "../../../../../../model/types/inputs/IMapFormInput";
import ILayerToolDimensions from "../../../../../../model/types/layer/ILayerToolDimensions";

/**
 * This class provides controls for management of the layer sidebar tab.
 * 
 * @author Jiri Hynek
 */
abstract class AbstractLayerToolSidebarTab<T extends ILayerTool> extends AbstractSidebarTab<T> implements ILayerToolSidebarTab {

    public constructor(tool: T, props: ILayerToolSidebarTabProps | undefined) {
        super(tool, props);
    }

    /**
     * It returns the props given by the programmer.
     */
    public getProps(): ILayerToolSidebarTabProps {
        return <ILayerToolSidebarTabProps> super.getProps();
    }
    
    /**
     * It returns default values of the sidebar tab.
     */
    public getDefaults(): ILayerToolSidebarTabDefaults {
        return <ILayerToolSidebarTabDefaults> super.getDefaults();
    }

    /**
     * It creates new defaults of the sidebar tab.
     */
    protected createDefaults(): ILayerToolSidebarTabDefaults {
        return <ILayerToolSidebarTabDefaults> new LayerToolSidebarTabDefaults(this);
    }

    /**
     * It returns the sidebar tab state.
     */
    public getState(): ILayerToolSidebarTabState {
        return <ILayerToolSidebarTabState> super.getState();
    }

    /**
     * It creates the sidebar tab state.
     */
    protected createState(): ILayerToolSidebarTabState {
        return <ILayerToolSidebarTabState> new LayerToolSidebarTabState(this);
    }

    /**
     * It updates inputs according to the given layer tool dimensions.
     * 
     * @param dimensions 
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    public setInputValues(dimensions: ILayerToolDimensions): void {
    }

    /**
     * Help method which returns a new universal autocomplete input for the any dimension.
     * 
     * @param dimension
     */
    protected getAutocompleteInput(dimension: IMapDimension<IMapDomain>): IMapFormInput {
        var _this = this;
        return new AutocompleteFormInput({
            label: dimension.getName(),
            options: dimension.getDomainManager().getDomainNames(),
            onChangeAction: function(ev: Event) {
                // get selected values and update layer tool's dimension
                const domains: IMapDomain[] = dimension.getDomainManager().getDomain((<HTMLInputElement> ev.target).value);
                dimension.setDomain(domains.length > 0 ? domains[0] : undefined);
                _this.getTool().setDimensionDomain(dimension, domains.length > 0 ? domains[0] : undefined);
            }
        });
    }
}
export default AbstractLayerToolSidebarTab;