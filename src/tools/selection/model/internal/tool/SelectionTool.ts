import SelectionToolState from "./SelectionToolState";
import SelectionToolEvent from "../event/SelectionToolEvent";
import SelectionToolDefaults from "./SelectionToolDefaults";
import SelectionToolTabFragment from "../sidebar/SelectionToolTabFragment";
import ISelectionToolProps from "../../types/tool/ISelectionToolProps";
import IMapSelection from "../../types/selection/IMapSelection";
import ISelectionTool from "../../types/tool/ISelectionTool";
import { ISidebarFragment, ISidebarFragmentControl } from "../../../../sidebar";
import ISelectionToolDefaults from "../../types/tool/ISelectionToolDefaults";
import ISelectionToolState from "../../types/tool/ISelectionToolState";
import MapTool from "../../../../../model/internal/tool/MapTool";

/**
 * This class provides the selection tool.
 * 
 * TODO: exclude defaults and state variables
 * 
 * @author Jiri Hynek
 */
class SelectionTool extends MapTool implements ISelectionTool, ISidebarFragmentControl {

    /**
     * TODO: move to the tool state.
     */
    private sidebarFragment: ISidebarFragment | undefined;

    /**
     * It creates a new tool with respect to the props.
     * 
     * @paramps 
     */
    public constructor(props: ISelectionToolProps | undefined) {
        super(props);

        // the tab fragment for a sidebar tab will be created only if needed
        this.sidebarFragment = undefined;
    }

    /**
     * It creates a copy of the uninitialized tool.
     */
    public copy(): ISelectionTool {
        return new SelectionTool(this.getProps());
    }

    /**
     * It returns the props given by the programmer.
     */
    public getProps(): ISelectionToolProps {
        return <ISelectionToolProps> super.getProps();
    }
    
    /**
     * It returns default values of the selection tool.
     */
    public getDefaults(): ISelectionToolDefaults {
        return <ISelectionToolDefaults> super.getDefaults();
    }

    /**
     * It creates new defaults of the tool.
     */
    public createDefaults(): ISelectionToolDefaults {
        return new SelectionToolDefaults(this);
    }

    /**
     * It returns the selection tool state.
     */
    public getState(): ISelectionToolState {
        return <ISelectionToolState> super.getState();
    }

    /**
     * It creates the tool state.
     */
    public createState(): ISelectionToolState {
        return new SelectionToolState(this);
    }

    /**
     * It creates new filter tool.
     */
    public create(): void {
        // set selection
        // not necessary
        //this.setSelection(this.getState().getSelection());
    }

    /**
     * 
     * @paramection 
     */
    public setSelection(selection: IMapSelection | null): void {
        // if the selection tool is enabled, update map selection
        if(this.isEnabled()) {
            // update tool state
            this.getState().setSelection(selection);

            // dispatch event
            this.getMap().dispatchEvent(new SelectionToolEvent(this, selection));
        }
    }

    /**
     * It returns a tab fragment.
     */
    public getSidebarFragment(): ISidebarFragment {
        if(this.sidebarFragment == undefined) {
            this.sidebarFragment = this.createSidebarFragment();
        }
        return this.sidebarFragment;
    }

    /**
     * It creates new tab control.
     */
    protected createSidebarFragment(): ISidebarFragment {
        return new SelectionToolTabFragment(this, {
            // defined by the sidebar fragment defaults
            id: undefined,
            enabled: undefined
        });
    }
}
export default SelectionTool;