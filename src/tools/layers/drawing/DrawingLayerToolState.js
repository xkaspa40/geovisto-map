import { AbstractLayerToolState } from '../abstract';
import L from 'leaflet';
import { highlightStyles, normalStyles } from './util/Poly';

/**
 * This class provide functions for using the state of the layer tool.
 *
 * @author Andrej Tlcina
 */
class DrawingLayerToolState extends AbstractLayerToolState {
  /**
   * It creates a tool state.
   */
  constructor(tool) {
    super();
    // * element/layer that was created
    this.currEl = null;

    this.featureGroup = new L.FeatureGroup();
    this.activeIndex = 0;
    // * for knowing if we are using select tool
    this.selecting = false;
    // * for knowing if we already selected layer
    this.selectedLayer = null;

    this.tool = tool;

    this.createdVertices = [];
    this.mappedMarkersToVertices = {};
  }

  isConnectMarker = (marker) => {
    return marker?.layerType === 'marker' && marker?.options?.icon?.options?.connectClick;
  };

  selectedLayerIsConnectMarker = () => {
    return this.isConnectMarker(this.selectedLayer);
  };

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
    this.tool.applyEventListeners(layer);
    return layer;
  }

  removeLayer(layer) {
    this.featureGroup.removeLayer(layer);
  }

  removeSelectedLayer(layer) {
    this.featureGroup.removeLayer(layer || this.selectedLayer);
    this.selectedLayer = null;
  }

  getLayerByIdx(idx) {
    const found = Object.values(this.featureGroup._layers).find((l) => l.kIdx === idx);
    return found;
  }

  removeLayerByIdx(idx) {
    if (idx === undefined) return;
    const found = Object.values(this.featureGroup._layers).find((l) => l.kIdx === idx);
    if (found) this.removeLayer(found);
  }

  setSelectedLayer(layer) {
    this.selectedLayer = layer;
    this.selecting = false;
    if (layer.setStyle) layer.setStyle(highlightStyles);
    else L.DomUtil.addClass(layer._icon, 'highlight-marker');
  }

  clearSelectedLayer() {
    this.selectedLayer = null;
    this.selecting = false;
  }

  serialize(defaults) {
    let config = super.serialize(defaults);

    const exportSettings = [];

    const pushPolygon = (layer, layerType) => {
      const { options, _latlngs: latlngs, popupContent = '' } = layer;
      exportSettings.push({
        layerType,
        options: { ...options, ...normalStyles, draggable: true, transform: true },
        latlngs,
        popupContent,
      });
    };

    this.featureGroup.eachLayer((layer) => {
      const { layerType } = layer;
      if (layerType === 'marker') {
        const { popupContent = '' } = layer;
        exportSettings.push({
          layerType,
          options: { ...layer?.options?.icon?.options, draggable: true, transform: true },
          latlngs: layer._latlng,
          popupContent,
        });
      } else {
        if (layer._layers) {
          layer.eachLayer((l) => {
            pushPolygon(l, layerType);
          });
        } else {
          pushPolygon(layer, layerType);
        }
      }
    });

    config.data = exportSettings;
    return config;
  }

  deserialize(config) {
    super.deserialize(config);

    const { data = [] } = config;

    data.forEach((layer) => {
      let layerToAdd;
      // decide what type they are according to it render what is needed
      if (layer.layerType === 'marker') {
        let { latlngs } = layer;
        let latlng = L.latLng(latlngs.lat, latlngs.lng);
        let options = {
          ...layer.options,
          iconAnchor: new L.Point(layer.options.iconAnchor.x, layer.options.iconAnchor.y),
          iconSize: new L.Point(layer.options.iconSize.x, layer.options.iconSize.y),
        };
        let MyCustomMarker = L.Icon.extend({
          options,
        });

        let icon = new MyCustomMarker();
        icon.options = options;
        let marker = new L.Marker.Touch(latlng, { icon });

        layerToAdd = marker;
      } else {
        let _latlng;
        let poly;
        if (layer.layerType === 'polyline') {
          _latlng = layer.latlngs.map((l) => L.latLng(l.lat, l.lng));
          poly = new L.polyline(_latlng, layer.options);
        }
        if (layer.layerType === 'polygon' || layer.layerType === 'painted') {
          _latlng = layer.latlngs[0].map((l) => L.latLng(l.lat, l.lng));
          poly = new L.polygon(_latlng, layer.options);
        }

        layerToAdd = poly;
      }

      if (layer.popupContent) {
        layerToAdd.bindPopup(layer.popupContent);
        layerToAdd.popupContent = layer.popupContent;
      }
      layerToAdd.layerType = layer.layerType;
      if (layerToAdd.dragging) layerToAdd.dragging.disable();
      this.addLayer(layerToAdd);
    });
  }
}
export default DrawingLayerToolState;
