import { AbstractLayerToolState } from '../abstract';

/**
 * This class provide functions for using the state of the layer tool.
 *
 * @author Andrej Tlcina
 */
class DrawingLayerToolState extends AbstractLayerToolState {
  /**
   * It creates a tool state.
   */
  constructor() {
    super();
    this.currEl = null;
    this.editableLayers = new L.FeatureGroup();
  }

  serialize() {
    const exportSettings = [];

    this.editableLayers.eachLayer((layer) => {
      const { layerType, popupContent = '' } = layer;
      if (layerType === 'marker') {
        exportSettings.push({
          layerType,
          options: layer.markerOptions,
          latlngs: layer._latlng,
          popupContent,
        });
      } else {
        const { options, _latlngs: latlngs } = layer;
        exportSettings.push({
          layerType,
          options,
          latlngs,
          popupContent,
        });
      }
    });

    return {
      drawingLayers: exportSettings,
    };
  }

  deserialize(config) {
    console.log({ config });
  }
}
export default DrawingLayerToolState;
