import IMapTheme from '../../../../types/theme/IMapTheme';
import BasicTheme from '../../basic/BasicTheme';

import './style.scss';

/**
 * This class wraps a filter operation.
 * 
 * @author Jiri Hynek
 */
class Light3Theme extends BasicTheme implements IMapTheme {

    /**
     * It initializes the light theme.
     */
    constructor() {
        super();
    }

    /**
     * It returns the theme type.
     */
    public getName(): string {
        return "light3";
    }
}
export default Light3Theme;