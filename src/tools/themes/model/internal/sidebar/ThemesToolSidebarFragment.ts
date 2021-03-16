import { ISidebarTab, ISidebarFragmentProps } from '../../../../sidebar';
import AbstractSidebarFragment from '../../../../sidebar/model/internal/fragment/AbstractSidebarFragment';
import SettingsTool from '../../../../settings/model/internal/tool/SettingsTool';
import IMapTheme from '../../types/theme/IMapTheme';
import IMapThemesManager from '../../types/theme/IMapThemesManager';
import IThemesTool from '../../types/tool/IThemesTool';
import AutocompleteFormInput from '../../../../../model/internal/inputs/labeled/autocomplete/AutocompleteFormInput';

/**
 * This class represents tab fragment for Themes tool.
 * 
 * @author Jiri Hynek
 */
class ThemesToolSidebarFragment extends AbstractSidebarFragment<IThemesTool> {
    
    private htmlContent: HTMLElement | undefined;

    /**
     * It creates a sidebar fragment with respect to the given props.
     * 
     * @param tool
     * @param props 
     */
    public constructor(tool: IThemesTool, props: ISidebarFragmentProps | undefined) {
        super(tool, props);
    }

    /**
     * The function returns true if the sidebar fragment should be included in the sidebar tab.
     * 
     * @param sidebarTab 
     */
    public isChild(sidebarTab: ISidebarTab): boolean {
        return sidebarTab.getTool().getType() == SettingsTool.TYPE();
    }

    /**
     * It returns a HTML content of the sidebar fragment which will be placed in a sidebar tab.
     */
    public getContent(): HTMLElement {
        if(this.htmlContent == undefined) {
            this.htmlContent = this.createContent();
        }
        return this.htmlContent;
    }

    /**
     * Help function which creates the HTML content.
     */
    protected createContent(): HTMLElement {
        // tab pane
        const htmlContent: HTMLDivElement = document.createElement('div');

        // theme input
        // TODO...
        // eslint-disable-next-line no-var
        var tool: IThemesTool = <IThemesTool> this.getState().getTool();
        // eslint-disable-next-line no-var
        var themesManager: IMapThemesManager = tool.getState().getThemesManager();
        // TODO: define types
        const changeTheme = function(e: any) {
            const newTheme: IMapTheme[] = themesManager.getByName(e.target.value);
            if(newTheme && newTheme.length > 0) {
                tool.setTheme(newTheme[0]);
            }
        };
        const themeInput = new AutocompleteFormInput({ label: "Theme", options: themesManager.getNames(), onChangeAction: changeTheme });
        htmlContent.appendChild(themeInput.create());
        themeInput.setValue(tool.getState().getTheme().getName());

        return htmlContent;
    }

}
export default ThemesToolSidebarFragment;