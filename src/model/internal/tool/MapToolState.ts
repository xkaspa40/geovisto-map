import MapObjectState from '../object/MapObjectState';
import IMapTool from '../../types/tool/IMapTool';
import IMapToolDefaults from '../../types/tool/IMapToolDefaults';
import IMapToolProps from '../../types/tool/IMapToolProps';
import IMapToolConfig from '../../types/tool/IMapToolConfig';
import IMapToolState from '../../types/tool/IMapToolState';
import IMap from '../../types/map/IMap';

/**
 * This class manages state of the tool.
 * It wraps the state since the tool can work with state objects which needs to be explicitly serialized.
 * 
 * @author Jiri Hynek
 */
class MapToolState extends MapObjectState implements IMapToolState {
    
    private enabled: boolean;
    
    /**
     * map is set during the tool initialization
     */
    private map: IMap | undefined;

    /**
     * It creates a map object state.
     * 
     * @param tool 
     */
    public constructor(tool : IMapTool) {
        super(tool);

        this.enabled = (<IMapToolDefaults> this.getDefaults()).isEnabled();
    }

    /**
     * It resets the state to the initial props.
     */
    public reset(): void {
        super.reset();

        const props = <IMapToolProps> this.getProps();
        const defaults = <IMapToolDefaults> this.getDefaults();

        // set the enabled property 
        this.setEnabled(props.enabled == undefined ? defaults.isEnabled() :  props.enabled);
    }

    /**
     * The metod takes config and deserializes the values.
     * 
     * @param config 
     */
    public deserialize(config: IMapToolConfig): void {
        super.deserialize(config);

        // tools properties
        if(config.enabled != undefined) this.setEnabled(config.enabled);
    }

    /**
     * The method serializes the tool state. Optionally, a serialized value can be let undefined if it equals the default value.
     * 
     * @param filterDefaults 
     */
    public serialize(filterDefaults : boolean | undefined): IMapToolConfig {
        const config: IMapToolConfig = <IMapToolConfig> super.serialize(filterDefaults);

        // tools properties
        config.enabled = filterDefaults && this.isEnabled() == (<IMapToolDefaults>  this.getDefaults()).isEnabled() ? undefined : this.isEnabled();
        
        return config;
    }

    /**
     * It returns the enabled property of the tool state.
     */
    public isEnabled(): boolean {
        return this.enabled;
    }

    /**
     * It sets the enabled property of tool state.
     * 
     * @param enabled 
     */
    public setEnabled(enabled: boolean): void {
       this.enabled = enabled;
    }

    /**
     * It returns the map property of the tool state.
     */
    public getMap(): IMap | undefined {
        return this.map;
    }

    /**
     * It sets the map property of the tool state.
     * 
     * @param map  
     */
    public setMap(map: IMap): void {
       this.map = map;
    }
}
export default MapToolState;