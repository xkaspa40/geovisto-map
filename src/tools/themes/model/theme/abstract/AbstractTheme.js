/**
 * This class wraps a filter operation.
 * 
 * @author Jiri Hynek
 */ 


class AbstractTheme {

    /**
     * It initializes the theme.
     */
    constructor() {
    }

    /**
     * It returns the theme type.
     */
    getType() {
        return "abstract";
    }

    /**
     * It returns the preferred base map.
     * 
     * Override this function.
     */
    getBaseMap() {
        return undefined;
    }

    /**
     * It returns if the styles preferres inversed dark colors.
     * 
     * Override this function.
     */
    isDark() {
        return false;
    }

    /**
     * It returns theme font
     */
    getFont(){
        return "'Trebuchet MS', sans-serif";
    }

    /**
     * It returns primary, secondary and disabled foreground colors used for text color
     * @return {primary:color, secondary:color2, disabled:color3}
     */
    getForegroundColors(){
        return {
            primary:"white", 
            secondary:"black", 
            disabled:"rgba(240, 240, 240, 0.8)"
        };
    }

    /**
     * It returns primary, secondary and disabled background colors
     * @return {primary:color, secondary:color, disabled:color}     
     */
    getBackgroundColors(){
        return {
            primary:"rgba(55, 71, 79, 0.9)", 
            secondary:"rgba(240, 240, 240, 0.8)", 
            disabled:"rgba(55, 71, 79, 0.4)"
        };
    }


    /**
     * It returns highlight colors for selected, highlighted and deepasized (not selected or highlighted) objects
     * @return {selected:color, highlight:color, deempasize:color}
     */
    getHighlightColor(){
        return {
            "selected":"orange",
            "highlight":"yellow",
            "deempasize":"#8c8c8c",
        };
    }

    /**
     * It returns color used for highlight hovered item
     * @return {color}
     */
    getHoverColor(){
        return "yellow";
    }

    /**
     * It returns 5 primary colors
     * monochrom - color used as color scale by changing its intensity
     * monochromComplement – complement to monochrom color (in contrast with monochorom)
     * triadic1,2,3 - 3 triadic colors scheme (triadic not required but colors contrast recommended)
     * @return {monochrom:color, monochromaComplement:color, triadic1:color, triadic2:color, triadic3:color}
     */
    getDataColors(){
        return {
            monochrom: undefined,
            monochromComplement: "slateblue",
            triadic1: "#c1c100",
            triadic2: "#c10000",
            triadic3: "#0006a7",
        }
    }

    /**
     * It returns text input colors
     * matchBg,matchFg- colors for match cases autocomplete
     * notMatchBg, notMatchFg- colors for not matching cases autocomplete
     * placeholder- color of placeholder
     * hover- color when hover object
     * @return {matchBg:color, matchFg:color, notMatchBg:color, notMatchFg:color, placeholder:color, hover:color}
     */  
    getTextInputColor(){
        return{
            matchBg:"white",
            matchFg:"black",
            notMatchBg:"#e6e6e6",
            notMatchFg:"#999999",
            placeholder:"#d9d9d9",
            hover:"#cccccc"
            }
    }

}
export default AbstractTheme;