import GenericObjectEvent from '../generic/GenericObjectEvent';

/**
 * This class provides the theme change event.
 *
 * @author Andrej Tlcina
 */
class ConfigChangeEvent extends GenericObjectEvent {
  /**
   * It initializes event.
   */
  constructor(source, data) {
    super(ConfigChangeEvent.TYPE(), source, data);
  }

  /**
   * Type of the event.
   */
  static TYPE() {
    return 'config-change-event';
  }
}
export default ConfigChangeEvent;
