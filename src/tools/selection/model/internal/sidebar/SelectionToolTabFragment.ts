import { ISidebarFragmentProps, ISidebarFragment, AbstractSidebarFragment, ISidebarTab, ISidebarTool } from '../../../../sidebar';
import { SettingsTool } from '../../../../settings';
import ISelectionTool from '../../types/tool/ISelectionTool';

/**
 * This class represents tab fragment for Themes tool.
 * 
 * @author Jiri Hynek
 */
class SelectionToolTabFragment extends AbstractSidebarFragment<ISelectionTool> implements ISidebarFragment {
    
    private htmlContent: HTMLElement | undefined;

    /**
     * It creates new sidebar fragment with respect to the given props.
     * 
     * @param tool
     * @param props 
     */
    public constructor(tool: ISelectionTool, props: ISidebarFragmentProps) {
        super(tool, props);
    }

    /**
     * The function returns true if the tab fragment should be included in the tab control.
     * 
     * @paramControl 
     */
    public isChild(sidebarTab: ISidebarTab): boolean {
        return sidebarTab.getTool().getType() == SettingsTool.TYPE();
    }

    /**
     * It returns fragment of tab pane which will be placed in sidebar tab.
     */
    public getContent(): HTMLElement {
        if(this.htmlContent == undefined) {
            this.htmlContent = this.createContent();
        }
        return this.htmlContent;
    }

    /**
     * Help function which creates tab content.
     */
    protected createContent(): HTMLElement {
        // tab pane
        const htmlContent = document.createElement('div');

        // TODO ... (selection settings)

        return htmlContent;
    }

}
export default SelectionToolTabFragment;