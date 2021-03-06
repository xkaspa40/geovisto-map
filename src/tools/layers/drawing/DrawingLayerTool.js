import L from 'leaflet';
import AbstractLayerTool from '../abstract/AbstractLayerTool';
import DrawingLayerToolState from './DrawingLayerToolState';
import DrawingLayerToolDefaults from './DrawingLayerToolDefaults';
import DrawingLayerToolTabControl from './sidebar/DrawingLayerToolTabControl';
import useDrawingToolbar from './components/useDrawingToolbar';
import union from '@turf/union';
import { highlightStyles, normalStyles } from './util/Poly';

import 'leaflet/dist/leaflet.css';
import './style/drawingLayer.scss';

/**
 * This class represents Drawing layer tool.
 *
 * @author Andrej Tlcina
 */
class DrawingLayerTool extends AbstractLayerTool {
  /**
   * It creates a new tool with respect to the props.
   *
   * @param {*} props
   */
  constructor(props) {
    super(props);
    useDrawingToolbar();
  }

  /**
   * A unique string of the tool type.
   */
  static TYPE() {
    return 'geovisto-tool-layer-drawing';
  }

  /**
   * It creates a copy of the uninitialized tool.
   */
  copy() {
    return new DrawingLayerTool(this.getProps());
  }

  /**
   * It creates new defaults of the tool.
   */
  createDefaults() {
    return new DrawingLayerToolDefaults();
  }

  /**
   * It returns default tool state.
   */
  createState() {
    return new DrawingLayerToolState();
  }

  /**
   * It returns a tab control.
   */
  getSidebarTabControl() {
    if (this.tabControl == undefined) {
      this.tabControl = this.createSidebarTabControl();
    }
    return this.tabControl;
  }

  redrawSidebarTabControl(layerType) {
    if (this.tabControl == undefined) return;
    this.tabControl.redrawTabContent(layerType);
  }

  /**
   * It creates new tab control.
   */
  createSidebarTabControl() {
    return new DrawingLayerToolTabControl({ tool: this });
  }

  applyEventListeners(layer) {
    layer.on('click', this.initChangeStyle, this);
    layer.on('mouseover', this.hightlightPoly, this);
    layer.on('mouseout', this.normalizePoly, this);
  }

  createdListener = (e) => {
    let layer = e.layer;
    layer.layerType = e.layerType;

    let geoFeature = layer.toGeoJSON();
    let feature = geoFeature.type === 'FeatureCollection' ? geoFeature.features[0] : geoFeature;
    let featureType = feature ? feature.geometry.type.toLowerCase() : '';

    let isFeaturePoly = featureType === 'polygon' || featureType === 'multipolygon';

    if (isFeaturePoly) {
      if (this.getState().prevPolyFeature) {
        let unifiedFeature = union(feature, this.getState().prevPolyFeature);
        let result = new L.GeoJSON(unifiedFeature, {
          ...layer.options,
        });
        layer = result;
        layer.layerType = 'polygon';
        this.getState().prevPolyFeature = unifiedFeature;
      } else {
        this.getState().prevPolyFeature = feature;
      }
    }

    let layerObjectToIterateThrough = this.getState().getEditableLayer()._layers || {};
    let prevPolyLayer = Object.values(layerObjectToIterateThrough).find(
      (l) => l.layerType === 'polygon',
    );
    this.getState().getEditableLayer().addLayer(layer);
    this.getState().setCurrEl(layer);
    this.applyEventListeners(layer);
    if (prevPolyLayer && isFeaturePoly)
      this.getState().getEditableLayer().removeLayer(prevPolyLayer);
    console.log({ group: this.getState().featureGroupArray });
  };

  /**
   * It creates layer items.
   */
  createLayerItems() {
    const combinedMap = this.getMap();
    const map = combinedMap.state.map;
    map.addControl(L.control.drawingToolbar({ tool: this }));
    // * eventlistener for when object is created
    map.on('draw:created', this.createdListener);

    return this.getState().featureGroupArray;
  }

  hightlightPoly(e) {
    if (!this.getState().getSelecting()) return;
    if (e.target._icon) {
      L.DomUtil.addClass(e.target._icon, 'highlight-marker');
    } else {
      e.target.setStyle(highlightStyles);
    }
  }

  normalizePoly(e) {
    if (!this.getState().getSelecting()) return;
    if (e.target._icon) {
      L.DomUtil.removeClass(e.target._icon, 'highlight-marker');
    } else {
      e.target.setStyle(normalStyles);
    }
  }

  initChangeStyle(e) {
    const drawObject = e.target;
    this.getState().setCurrEl(drawObject);
    this.redrawSidebarTabControl(e.target.layerType);
    this.getState().setSelecting(!this.getState().getSelecting());
  }

  /**
   * This function is called when layer items are rendered.
   */
  postCreateLayerItems() {}

  /**
   * It reloads data and redraw the layer.
   */
  redraw(onlyStyle) {
    console.log('...redrawing');

    this.hideLayerItems();
    this.showLayerItems();
  }

  /**
   * This function is called when a custom event is invoked.
   *
   * @param {AbstractEvent} event
   */
  handleEvent(event) {}
}

export default DrawingLayerTool;
