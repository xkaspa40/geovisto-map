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
    this.currEl = null;
    this.prevPolyFeature = null;
    this.featureGroupArray = [new L.FeatureGroup()];
    this.activeIndex = 0;
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

  /**
   * Returns feature group with elements defined in it
   * You can call it without parameter to simply get last one
   *
   * @param {number} idx
   */
  getEditableLayer(idx) {
    const featureArrLen = this.featureGroupArray.length;
    const index = idx === undefined ? featureArrLen - 1 : idx;
    return this.featureGroupArray[index];
  }

  addEditableLayer() {
    this.featureGroupArray.push(new L.FeatureGroup());
  }

  clearPrevPolyFeature() {
    this.prevPolyFeature = null;
  }

  setCurrEl(val) {
    this.currEl = val;
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
