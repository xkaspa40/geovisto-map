import SelectionTool from "./SelectionTool";
import IMapSelection from "../../types/selection/IMapSelection";
import MapToolDefaults from "../../../../../model/internal/tool/MapToolDefaults";
import ISelectionToolDefaults from "../../types/tool/ISelectionToolDefaults";
import ISelectionTool from "../../types/tool/ISelectionTool";
import ISelectionToolConfig from "../../types/tool/ISelectionToolConfig";
import { TOOL_TYPE } from "../../..";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class SelectionToolDefaults extends MapToolDefaults implements ISelectionToolDefaults {

    /**
     * It creates tool defaults.
     */
    public constructor(tool: ISelectionTool) {
        super(tool);
    }

    /**
     * It returns the default config.
     */
    public getConfig(): ISelectionToolConfig {
        const config = <ISelectionToolConfig> super.getConfig();
        config.selection = undefined;
        return config;
    }

    /**
     * Only one selection tool should be present in the Geovisto map.
     */
    public isSingleton(): boolean {
       return true; 
    }

    /**
     * It returns a unique string of the tool type.
     */
    public getType(): string {
        return TOOL_TYPE;
    }

    /**
     * It returns default map selection.
     */
    public getSelection(): IMapSelection | null {
        return null;
    }
}
export default SelectionToolDefaults;