import AbstractTheme from '../../abstract/AbstractTheme';


/**
 * This class wraps a filter operation.
 * 
 * @author Jiri Hynek
 */
class Dark2Theme extends AbstractTheme {

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
        return "dark2";
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
         * It returns theme font
         */
    getFont() {
        return "Verdana, sans-serif";
    }

    /**
     * It returns primary, secondary and disabled foreground colors used for text color
     * @return {primary:color, secondary:color2, disabled:color3}
     */
    getForegroundColors() {
        return {
            primary: "#86d486",
            secondary: "#b3b3b3",
            disabled: "#b3b3b3"
        };
    }

    /**
     * It returns primary, secondary and disabled background colors
     * @return {primary:color, secondary:color, disabled:color}     
     */
    getBackgroundColors() {
        return {
            primary: "#1a1a1a",
            secondary: "rgb(102, 102, 102, 0.95)",
            disabled: "#f2f2f2"
        };
    }

    /**
     * It returns color used for highlight hovered item
     * @return {color}
     */
    getHoverColor() {
        return "#cffccf";
    }

    /**
     * It returns 4 primary colors
     * monochrom - color used as color scale by changing its intensity
     * lineColor – easy visible color with high contrast
     * triadic1,2,3 - 3 triadic colors scheme (triadic not required but colors contrast recommended)
     * @return {monochrom:color, monochromaComplement:color, triadic1:color, triadic2:color, triadic3:color}
     */
    getDataColors() {
        return {
            monochrom: undefined,
            lineColor: "#009933",
            triadic1: "#ecec79",
            triadic2: "#e87d7d",
            triadic3: "#a3a3f5",
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
    getTextInputColor() {
        return {
            matchBg: "#8c8c8c",
            matchFg: "#d9d9d9",
            notMatchBg: "#666666",
            notMatchFg: "#b3b3b3",
            placeholder: "#bfbfbf",
            hover: "rgb(0, 51, 0, 0.3)"
        }
    }

}
export default Dark2Theme;