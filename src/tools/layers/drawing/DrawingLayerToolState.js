import { AbstractLayerToolState } from '../abstract';
import L from 'leaflet';

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
    // * element/layer that was created
    this.currEl = null;

    this.featureGroup = new L.FeatureGroup();
    this.activeIndex = 0;
    // * for knowing if we are using select tool
    this.selecting = false;
    // * for knowing if we already selected layer
    this.selectedLayer = null;
  }

  setActiveIndex(idx) {
    this.activeIndex = idx;
  }

  increaseActiveIndex() {
    this.activeIndex += 1;
  }

  getActiveIndex() {
    return this.activeIndex;
  }

  getPrevLayer() {
    let layersObj = this.featureGroup._layers;
    let layersArr = [...Object.values(layersObj)];
    return layersArr.pop();
  }

  setCurrEl(val) {
    this.currEl = val;
  }

  setSelecting(is) {
    this.selecting = is;
  }

  getSelecting() {
    return this.selecting;
  }

  addLayer(layer) {
    this.featureGroup.addLayer(layer);
  }

  removeLayer(layer) {
    this.featureGroup.removeLayer(layer);
  }

  setSelectedLayer(layer) {
    this.selectedLayer = layer;
  }

  clearSelectedLayer() {
    this.selectedLayer = null;
  }

  serialize(defaults) {
    let config = super.serialize(defaults);

    const exportSettings = [];

    // this.editableLayers.eachLayer((layer) => {
    //   const { layerType, popupContent = '' } = layer;
    //   if (layerType === 'marker') {
    //     exportSettings.push({
    //       layerType,
    //       options: layer.markerOptions,
    //       latlngs: layer._latlng,
    //       popupContent,
    //     });
    //   } else {
    //     const { options, _latlngs: latlngs } = layer;
    //     exportSettings.push({
    //       layerType,
    //       options,
    //       latlngs,
    //       popupContent,
    //     });
    //   }
    // });

    // config.data = exportSettings;
    return config;
  }

  deserialize(config) {
    super.deserialize(config);

    const { data = [] } = config;

    const map = this.map.state;

    console.log({ map });

    if (!map) return;

    // data.forEach((layer) => {
    //   // decide what type they are according to it render what is needed
    //   if (layer.layerType === 'marker') {
    //     let { latlngs } = layer;
    //     let latlng = L.latLng(latlngs.lat, latlngs.lng);
    //     let MyCustomMarker = L.Icon.extend({
    //       options: layer.options,
    //     });

    //     let marker = new L.Marker.Touch(latlng, { icon: new MyCustomMarker() });
    //     if (layer.popupContent) {
    //       marker.bindPopup(layer.popupContent);
    //       marker.popupContent = layer.popupContent;
    //     }
    //     marker.addTo(map);
    //     map.fire(L.Draw.Event.CREATED, { layer: marker, layerType: 'marker' });
    //   } else {
    //     if (layer.layerType === 'polyline' || layer.layerType === 'vertice') {
    //       let _latlng = layer.latlngs.map((l) => L.latLng(l.lat, l.lng));
    //       let poly = new L.polyline(_latlng, layer.options);
    //       if (layer.popupContent) {
    //         poly.bindPopup(layer.popupContent);
    //         poly.popupContent = layer.popupContent;
    //       }
    //       poly.addTo(map);
    //       map.fire(L.Draw.Event.CREATED, { layer: poly, layerType: layer.layerType });
    //     }
    //     if (layer.layerType === 'polygon') {
    //       let _latlng = layer.latlngs[0].map((l) => L.latLng(l.lat, l.lng));
    //       let poly = new L.polygon(_latlng, layer.options);
    //       if (layer.popupContent) {
    //         poly.bindPopup(layer.popupContent);
    //         poly.popupContent = layer.popupContent;
    //       }
    //       poly.addTo(map);
    //       map.fire(L.Draw.Event.CREATED, { layer: poly, layerType: 'polygon' });
    //     }
    //   }
    // });
  }
}
export default DrawingLayerToolState;
