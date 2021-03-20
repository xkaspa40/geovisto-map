import AbstractTheme from '../../abstract/AbstractTheme';


/**
 * This class wraps a filter operation.
 * 
 * @author Jiri Hynek
 */
class Dark3Theme extends AbstractTheme {

    /**
     * It initializes the dark theme.
     */
    constructor() {
        super();
    }

    /**
     * It returns the theme type.
     */
    getType() {
        return "dark3";
    }

    /**
     * This theme prefers dark colors.
     */
    isDark() {
        return true;
    }

    /**
     * It returns the preferred base map.
     */
    getBaseMap() {
        return 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png';
    }


    /**
     * It returns primary, secondary and disabled foreground colors used for text color
     * @return {primary:color, secondary:color2, disabled:color3}
     */
    getForegroundColors(){
        return {
            primary:"#b3b3b3", 
            secondary:"#808080",
            disabled:"#cccccc"
        };
    }

    /**
     * It returns primary, secondary and disabled background colors
     * @return {primary:color, secondary:color, disabled:color}     
     */
    getBackgroundColors(){
        return {
            primary:"#666666", 
            secondary:"#1a1a1a", 
            disabled:"#f2f2f2"
        };
    }


    /**
     * It returns highlight colors for selected, highlighted and deepasized (not selected or highlighted) objects
     * @return {selected:color, highlight:color, deempasize:color}
     */
    getHighlightColor(){
        return {
            "selected":"rgba(51, 189, 247, 0.9)",
            "highlight":"rgba(0, 235, 255, 0.8)",
            "deempasize":"#1d1616",
        };
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
            monochromComplement: "#c188dd",
            triadic1: "#739550",
            triadic2: "#fff729",
            triadic3: "rgba(255, 0, 0, 0.69)",
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
            matchBg:"#8c8c8c",
            matchFg:"#d9d9d9",
            notMatchBg:"#666666",
            notMatchFg:"#b3b3b3",
            placeholder:"#bfbfbf",
            hover:"rgb(0, 51, 0, 0.3)"
            }
    }


}
export default Dark3Theme;