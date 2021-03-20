import AbstractTheme from '../../abstract/AbstractTheme';


/**
 * This class wraps a filter operation.
 * 
 * @author Jiri Hynek
 */
class Light3Theme extends AbstractTheme {

    /**
     * It initializes the light theme.
     */
    constructor() {
        super();
    }

    /**
     * It returns the theme type.
     */
    getType() {
        return "light3";
    }

    /**
     * It returns the preferred base map.
     */
    getBaseMap() {
        return 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
    }
       
    /**
     * It returns theme font
     */
    getFont(){
        return "Georgia, serif";
    }

    /**
     * It returns primary, secondary and disabled foreground colors used for text color
     * @return {primary:color, secondary:color2, disabled:color3}
     */
    getForegroundColors(){
        return {
            primary:"#3e3e3e", 
            secondary:"#ffffff", 
            disabled:"#cccccc"
        };
    }

    /**
     * It returns primary, secondary and disabled background colors
     * @return {primary:color, secondary:color, disabled:color}     
     */
    getBackgroundColors(){
        return {
            primary:"#e8e8e8", 
            secondary:"rgba(122, 153, 156, 0.86)", 
            disabled:"#f2f2f2"
        };
    }


    /**
     * It returns highlight colors for selected, highlighted and deepasized (not selected or highlighted) objects
     * @return {selected:color, highlight:color, deempasize:color}
     */
    getHighlightColor(){
        return {
            "selected":"#52bcd6",
            "highlight":"#1f7f9d",
            "deempasize":"#969e94",
        };
    }

    /**
     * It returns color used for highlight hovered item
     * @return {color}
     */
    getHoverColor(){
        return "#9df1ff";
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
            monochromComplement: "#118993",
            triadic1: "rgba(255, 38, 8, 0.73)",
            triadic2: "rgba(235, 255, 28, 0.74)",
            triadic3: "#ffc341",
        }
    }
}
export default Light3Theme;