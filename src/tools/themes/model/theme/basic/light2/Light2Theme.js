import AbstractTheme from '../../abstract/AbstractTheme';


/**
 * This class wraps a filter operation.
 * 
 * @author Jiri Hynek
 */
class Light2Theme extends AbstractTheme {

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
        return "light2";
    }
    getHoverColor(){
        return "green";
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
            primary:"#ffffff", 
            secondary:"#1c1c1c", 
            disabled:"#cccccc"
        };
    }

    /**
     * It returns primary, secondary and disabled background colors
     * @return {primary:color, secondary:color, disabled:color}     
     */
    getBackgroundColors(){
        return {
            primary:"#363636", 
            secondary:"rgba(184, 184, 184, 0.82)", 
            disabled:"#f2f2f2"
        };
    }


    /**
     * It returns highlight colors for selected, highlighted and deepasized (not selected or highlighted) objects
     * @return {selected:color, highlight:color, deempasize:color}
     */
    getHighlightColor(){
        return {
            "selected":"rgba(41, 41, 41, 1)",
            "highlight":"rgba(87, 87, 87, 0.79)",
            "deempasize":"rgba(215, 215, 215, 0.93)",
        };
    }

    /**
     * It returns color used for highlight hovered item
     * @return {color}
     */
    getHoverColor(){
        return "rgba(255, 238, 0, 0.37)";
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
            monochromComplement: "#000000",
            triadic1: "#000000",
            triadic2: "#7a7a7a",
            triadic3: "#ffffff",
        }
    }

}
export default Light2Theme;