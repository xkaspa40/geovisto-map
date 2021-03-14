import GenericObjectEvent from '../generic/GenericObjectEvent';

/**
 * This class provides the theme change event.
 *
 * @author Andrej Tlcina
 */
class MapCreatedEvent extends GenericObjectEvent {
  /**
   * It initializes event.
   */
  constructor(source, data) {
    super(MapCreatedEvent.TYPE(), source, data);
  }

  /**
   * Type of the event.
   */
  static TYPE() {
    return 'map-created-event';
  }
}
export default MapCreatedEvent;
