import L from 'leaflet';
import AbstractLayerTool from '../abstract/AbstractLayerTool';
import DrawingLayerToolState from './DrawingLayerToolState';
import DrawingLayerToolDefaults from './DrawingLayerToolDefaults';
import DrawingLayerToolTabControl from './sidebar/DrawingLayerToolTabControl';
import useDrawingToolbar from './components/useDrawingToolbar';
import union from '@turf/union';
import {
  convertOptionsToProperties,
  convertPropertiesToOptions,
  featureToLeafletCoordinates,
  getGeoJSONFeatureFromLayer,
  getLeafletTypeFromFeature,
  highlightStyles,
  normalStyles,
  getFeatFromLayer,
  isFeaturePoly,
  getSimplifiedPoly,
} from './util/Poly';

import 'leaflet/dist/leaflet.css';
import './style/drawingLayer.scss';
import difference from '@turf/difference';
import MapCreatedEvent from '../../../model/event/basic/MapCreatedEvent';
import { iconStarter } from './util/Marker';
import { filter } from 'd3-array';
import lineToPolygon from '@turf/line-to-polygon';
import * as turf from '@turf/turf';
import * as martinez from 'martinez-polygon-clipping';
import * as polyClipping from 'polygon-clipping';
import './components/Edit';
import 'leaflet-snap';
import 'leaflet-geometryutil';
import 'leaflet-draw';

import * as d33 from 'd3-3-5-5';
import Pather from 'leaflet-pather';

// !inject in rollup config doesn't work and pather throws errors without this line
window.d3 = d33;

// * as advised in https://github.com/makinacorpus/Leaflet.Snap/issues/52
L.Draw.Feature.include(L.Evented.prototype);
L.Draw.Feature.include(L.Draw.Feature.SnapMixin);
L.Draw.Feature.addInitHook(L.Draw.Feature.SnapMixin._snap_initialize);

const SPACE_BAR = 32;

export const DRAWING_TOOL_LAYER_TYPE = 'geovisto-tool-layer-drawing';

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
    return DRAWING_TOOL_LAYER_TYPE;
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
    return new DrawingLayerToolState(this);
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

  // ? possibly move to state
  serializeToGeoJSON() {
    const geo = {
      type: 'FeatureCollection',
      features: [],
    };

    this.getState().featureGroup.eachLayer((l) => {
      let feature = l.toGeoJSON();
      // * so we don't save selected polygon
      let properties = convertOptionsToProperties(l.options);
      feature.properties = properties;
      geo.features.push(feature);
    });

    return geo;
  }

  // ? possibly move to state
  deserializeGeoJSON(geojson) {
    // console.log({ geojson });
    if (geojson.type === 'FeatureCollection' && geojson.features) {
      geojson.features.forEach((f) => {
        let opts = convertPropertiesToOptions(f.properties);
        let lType = getLeafletTypeFromFeature(f);
        featureToLeafletCoordinates(f.geometry.coordinates, f.geometry.type);
        let result;
        if (lType === 'polygon') {
          result = new L.polygon(f.geometry.coordinates, opts);
        } else if (lType === 'polyline') {
          result = new L.polyline(f.geometry.coordinates, opts);
        } else if (lType === 'marker') {
          let options = {
            ...iconStarter,
            iconUrl: this.getSidebarTabControl().getState().getSelectedIcon(),
            ...f.properties,
          };

          let icon = new L.Icon(options);
          result = new L.Marker.Touch(f.geometry.coordinates, { icon });
        }
        if (result) {
          result.layerType = lType;
          if (result.dragging) result.dragging.disable();
          this.getState().addLayer(result);
        }
      });
    }
    return;
  }

  search() {
    this.redrawSidebarTabControl('search');
  }

  applyEventListeners(layer) {
    layer.on('click', L.DomEvent.stopPropagation).on('click', this.initChangeStyle, this);
    layer.on('mouseover', this.hightlightPoly, this);
    layer.on('mouseout', this.normalizePoly, this);
  }

  polyDiff(layer) {
    let selectedLayer = this.getState().selectedLayer;
    let paintPoly = this.getSidebarTabControl().getState().paintPoly;
    let fgLayers = this.getState().featureGroup._layers;

    let layerFeature = getGeoJSONFeatureFromLayer(layer);
    let currentLayerType = layerFeature ? layerFeature.geometry.type.toLowerCase() : '';
    let isCurrentLayerPoly = currentLayerType === 'polygon' || currentLayerType === 'multipolygon';

    // let createdIsNotEraser = layer.layerType !== 'erased';

    if (isCurrentLayerPoly) {
      Object.values(fgLayers)
        .filter((l) => {
          let feature = getGeoJSONFeatureFromLayer(l);
          let featureType = feature ? feature.geometry.type.toLowerCase() : '';
          return featureType === 'polygon' || featureType === 'multipolygon';
        })
        .forEach((l) => {
          let feature = getGeoJSONFeatureFromLayer(l);

          let layerIsNotSelected = l?._leaflet_id !== selectedLayer?._leaflet_id;
          // let canDiff = !createdIsNotEraser ? true : layerIsNotSelected;
          if (layerIsNotSelected) {
            let diffFeature = difference(feature, layerFeature);
            if (diffFeature) {
              let coords;
              let latlngs;
              try {
                coords = diffFeature.geometry.coordinates;
                // * when substracting you can basically slice polygon into more parts then we have to increase depth by one
                let depth = coords.length === 1 ? 1 : 2;
                coords.forEach((coord) => {
                  latlngs = L.GeoJSON.coordsToLatLngs([coord], depth);
                  latlngs = getSimplifiedPoly(...latlngs);
                  let result = new L.polygon(latlngs, {
                    ...l.options,
                  });
                  result?.dragging?.disable();
                  result.layerType = 'polygon';
                  result._latlngs = depth === 1 ? result._latlngs : result._latlngs[0];
                  this.getState().addLayer(result);
                  this.getState().removeLayer(l);
                  paintPoly.clearPaintedPolys(l.kIdx);
                });
              } catch (error) {
                console.error({ coords, latlngs, error });
              }
            } else {
              this.getState().removeLayer(l);
              paintPoly.clearPaintedPolys(l.kIdx);
            }
          }
        });
    }
  }

  polyJoin(layer, eKeyIndex) {
    let paintPoly = this.getSidebarTabControl().getState().paintPoly;

    // * gets only first one because I do not expect MultiPolygon to be created
    let feature = getFeatFromLayer(layer);
    feature = Array.isArray(feature) ? feature[0] : feature;
    let isFeatPoly = isFeaturePoly(feature);
    if (!isFeatPoly) return layer;

    let unifiedFeature = feature;

    let selectedLayer = this.getState().selectedLayer;
    let selectedFeatures = getFeatFromLayer(selectedLayer);
    if (!selectedFeatures) return layer;
    selectedFeatures.forEach((selectedFeature) => {
      let isSelectedFeaturePoly = isFeaturePoly(selectedFeature);

      if (isSelectedFeaturePoly) {
        unifiedFeature = union(selectedFeature, unifiedFeature);
      }
    });

    let coords = unifiedFeature.geometry.coordinates;
    let depth = 1;
    if (unifiedFeature.geometry.type === 'MultiPolygon') {
      depth = 2;
    }
    let latlngs = L.GeoJSON.coordsToLatLngs(coords, depth);
    latlngs = getSimplifiedPoly(...latlngs);
    let result = new L.polygon(latlngs, {
      ...layer.options,
      draggable: true,
      transform: true,
    });
    layer = result;
    layer.layerType = 'polygon';
    if (layer.dragging) layer.dragging.disable();
    paintPoly.clearPaintedPolys(eKeyIndex);
    this.getState().removeSelectedLayer(selectedLayer);
    this.getState().setSelectedLayer(layer);
    return layer;
  }

  polySlice(layer) {
    let lineFeat = getGeoJSONFeatureFromLayer(layer);

    let selectedLayer = this.getState().selectedLayer;
    if (selectedLayer) {
      const THICK_LINE_WIDTH = 0.001;
      const THICK_LINE_UNITS = 'kilometers';
      let offsetLine;
      let f = getGeoJSONFeatureFromLayer(selectedLayer);

      let fType = f ? f.geometry.type.toLowerCase() : '';
      let isFeatPoly = fType === 'polygon' || fType === 'multipolygon';
      if (isFeatPoly) {
        let coords;
        let latlngs;
        try {
          offsetLine = turf.lineOffset(lineFeat, THICK_LINE_WIDTH, {
            units: THICK_LINE_UNITS,
          });

          let polyCoords = [];
          for (let j = 0; j < lineFeat.geometry.coordinates.length; j++) {
            polyCoords.push(lineFeat.geometry.coordinates[j]);
          }
          for (let j = offsetLine.geometry.coordinates.length - 1; j >= 0; j--) {
            polyCoords.push(offsetLine.geometry.coordinates[j]);
          }
          polyCoords.push(lineFeat.geometry.coordinates[0]);

          let thickLineString = turf.lineString(polyCoords);
          let thickLinePolygon = turf.lineToPolygon(thickLineString);
          let clipped = turf.difference(f, thickLinePolygon);

          coords = clipped.geometry.coordinates;
          coords.forEach((coord) => {
            latlngs = L.GeoJSON.coordsToLatLngs(coord, 1);
            latlngs = getSimplifiedPoly(...latlngs);
            let result = new L.polygon(latlngs, {
              ...selectedLayer.options,
              ...normalStyles,
            });
            result.layerType = 'polygon';
            this.getState().removeSelectedLayer(selectedLayer);
            this.getState().addLayer(result);
          });
        } catch (error) {
          console.error({ coords, latlngs, error });
        }
      }
    }
  }

  haveSameVertice(current) {
    const found = this.state.createdVertices.find((vertice) => {
      return (
        (vertice._latlngs[0].equals(current._latlngs[0]) &&
          vertice._latlngs[1].equals(current._latlngs[1])) ||
        (vertice._latlngs[0].equals(current._latlngs[1]) &&
          vertice._latlngs[1].equals(current._latlngs[0]))
      );
    });

    return Boolean(found);
  }

  plotTopology() {
    const combinedMap = this.getMap();
    const map = combinedMap.state.map;
    const selectedLayer = this.getState().selectedLayer;

    const layersObj = this.state.featureGroup._layers;
    const layerArr = [...Object.values(layersObj)];
    const _markers = layerArr
      .filter((_) => _.layerType === 'marker' && _?.options?.icon?.options?.connectClick)
      .reverse();
    // console.log({ _markers });
    const topologyVertices = [];
    const index = 0;
    const firstMarker = _markers[index];

    const selectedLayerIsConnectMarker = this.getState().selectedLayerIsConnectMarker();

    const secondMarker = selectedLayerIsConnectMarker ? selectedLayer : _markers[index + 1];
    if (secondMarker) {
      const { lat: fLat, lng: fLng } = firstMarker.getLatLng();
      const { lat: sLat, lng: sLng } = secondMarker.getLatLng();

      let _latlng = [L.latLng(fLat, fLng), L.latLng(sLat, sLng)];
      let poly = new L.polyline(_latlng, {
        color: '#563412',
        weight: 3,
        ...normalStyles,
      });
      if (!this.haveSameVertice(poly)) {
        poly.addTo(map);
        topologyVertices.push(poly);
        this.state.createdVertices.push(poly);
        map.fire(L.Draw.Event.CREATED, { layer: poly, layerType: 'vertice' });
      }
    }

    this.mapMarkersToVertices(_markers);
  }

  mapMarkersToVertices(_markers) {
    _markers
      .map((marker) => ({ latlng: marker.getLatLng(), lId: marker._leaflet_id, marker }))
      .forEach(({ latlng, lId, marker }) => {
        this.state.createdVertices.forEach((layer) => {
          // * used indexing instead of another loop (vertices have only 2 points)
          let spread = this.state.mappedMarkersToVertices[lId] || [];
          if (layer.getLatLngs()[0].equals(latlng)) {
            this.state.mappedMarkersToVertices[lId] = [...spread, { layer, index: 0 }];
          } else if (layer.getLatLngs()[1].equals(latlng)) {
            this.state.mappedMarkersToVertices[lId] = [...spread, { layer, index: 1 }];
          }
        });
      });
  }

  changeVerticesLocation(latlng, oldlatlng, markerID) {
    const markerVertices = this.state.mappedMarkersToVertices[markerID];
    if (!markerVertices || !markerVertices?.length) return;

    this.setVerticesCoordinates(markerVertices, latlng);
  }

  setVerticesCoordinates(markerVertices, latlng) {
    markerVertices.forEach((vertice) => {
      let latLngs = L.LatLngUtil.cloneLatLngs(vertice.layer._latlngs);
      latLngs[vertice.index] = latlng;
      vertice.layer.setLatLngs(latLngs);
    });
  }

  createdListener = (e) => {
    let layer = e.layer;
    layer.layerType = e.layerType;
    if (e.keyIndex) layer.kIdx = e.keyIndex;

    let prevLayer = this.getState().getPrevLayer();
    if (prevLayer?.layerType !== e.layerType) this.redrawSidebarTabControl(e.layerType);
    if (e.layerType !== 'painted') this.getSidebarTabControl().getState().setEnabledEl(null);

    if (e.layerType === 'polygon' || e.layerType === 'painted') {
      // * JOIN
      layer = this.polyJoin(layer, e.keyIndex);
    }

    if (e.layerType === 'polygon' || e.layerType === 'painted' || e.layerType === 'erased') {
      // * DIFFERENCE
      this.polyDiff(layer);
    }

    // if (e.layerType === 'painted') {
    //   // * for reducing editing nodes
    //   layer.editing = new L.Edit.ExtendedPoly(layer);
    // }

    if (layer.dragging) layer.dragging.disable();

    if (e.layerType !== 'knife' && e.layerType !== 'erased') {
      this.getState().addLayer(layer);
      this.getState().setCurrEl(layer);
      this.getSidebarTabControl().getState().pushGuideLayer(layer);
    }

    if (e.layerType === 'erased') {
      const combinedMap = this.getMap();
      const map = combinedMap.state.map;
      map.removeLayer(layer);
      let paintPoly = this.getSidebarTabControl().getState().paintPoly;
      paintPoly.clearPaintedPolys(e.keyIndex);
    }

    // * MARKER
    if (e.layerType === 'marker') {
      this.applyTopologyMarkerListeners(layer);
      if (layer?.options?.icon?.options?.connectClick) {
        this.plotTopology();
      }
    }
  };

  applyTopologyMarkerListeners(layer) {
    layer.on('drag', (event) => {
      const { latlng, oldLatLng, target } = event;

      // console.log({ lat: latlng.lat, lng: latlng.lng, oldlat: oldLatLng.lat, oldlng: oldLatLng.lng });

      this.changeVerticesLocation(latlng, oldLatLng, target._leaflet_id);
    });
  }

  createdPath = (e) => {
    // * get polyline object
    const layer = e.polyline.polyline;

    // * get Leaflet map
    const combinedMap = this.getMap();
    const map = combinedMap.state.map;

    // * get sidebar state and pather object
    const sidebarState = this.getSidebarTabControl().getState();
    const pather = sidebarState.pather;
    // * SLICE
    this.polySlice(layer);

    // * we do not want path to stay
    pather.removePath(layer);
    // * we do not want to keep cutting (drawing)
    map.removeLayer(pather);
    sidebarState.setPatherStatus(false);
  };

  /**
   * It creates layer items.
   */
  createLayerItems() {
    console.log('%c ...creating', 'color: #ff5108');
    const combinedMap = this.getMap();
    const map = combinedMap.state.map;
    map.addControl(L.control.drawingToolbar({ tool: this }));
    // * eventlistener for when object is created
    map.on('draw:created', this.createdListener);

    map.on('click', () => {
      const sidebar = this.getSidebarTabControl();
      if (Boolean(sidebar.getState().enabledEl)) return;
      let selected = this.getState().selectedLayer;
      if (selected) {
        if (selected.setStyle) selected.setStyle(normalStyles);
        this.getState().clearSelectedLayer();
        this.redrawSidebarTabControl();
        this.getState().setCurrEl(null);
        this.initTransform(selected);
        document.querySelector('.leaflet-container').style.cursor = '';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.keyCode === SPACE_BAR) {
        let enabledEl = this.getSidebarTabControl().getState().enabledEl;
        if (enabledEl) {
          enabledEl.disable();
          // map.dragging.enable(); // we do not have to do this, it is already on always
        }
      }
    });
    document.addEventListener('keyup', (e) => {
      if (e.keyCode === SPACE_BAR) {
        let enabledEl = this.getSidebarTabControl().getState().enabledEl;
        if (enabledEl) {
          enabledEl.enable();
          // map.dragging.disable(); // we do not have to do this, it is already on always
        }
      }
    });

    const pather = this.getSidebarTabControl().getState().pather;
    pather.on('created', this.createdPath);

    const layer = this.getState().featureGroup;
    layer.eachLayer((layer) => {
      layer.addTo(map);
      this.applyEventListeners(layer);
    });
    return [layer];
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

    let fgLayers = this.getState().featureGroup._layers;
    Object.values(fgLayers).forEach((_) => {
      if (_.setStyle) _.setStyle(normalStyles);
      if (_._icon) {
        L.DomUtil.removeClass(_._icon, 'highlight-marker');
        _.dragging.disable();
      }
      if (_?.transform?._enabled) {
        _.transform.disable();
        let paintPoly = this.getSidebarTabControl().getState().paintPoly;
        paintPoly.updatePaintedPolys(_.kIdx, _);
      }
    });
    this.getState().setSelectedLayer(drawObject);
    this.getState().setCurrEl(drawObject);
    this.initTransform(drawObject);
    this.redrawSidebarTabControl(e.target.layerType);

    document.querySelector('.leaflet-container').style.cursor = '';
  }

  initTransform(drawObject) {
    const layer = drawObject;
    if (layer?.transform) {
      if (layer.transform._enabled) {
        layer.transform.disable();
        layer.dragging.disable();
        let paintPoly = this.getSidebarTabControl().getState().paintPoly;
        paintPoly.updatePaintedPolys(layer.kIdx, layer);
      } else {
        layer.transform.enable({ rotation: true, scaling: true });
        layer.dragging.enable();
      }
    } else if (layer.layerType === 'marker') {
      if (layer.dragging._enabled) {
        layer.dragging.disable();
      } else {
        layer.dragging.enable();
      }
    }
  }

  removeElement() {
    if (this.getState().selectedLayerIsConnectMarker()) {
      const selectedLayer = this.getState().selectedLayer;
      const markerVertices = this.state.mappedMarkersToVertices[selectedLayer._leaflet_id];
      console.log({ markerVertices });
      markerVertices?.forEach((v) => this.getState().removeLayer(v?.layer));
    }
    this.getState().removeSelectedLayer();
  }

  selectElement() {
    const selecting = this.getState().getSelecting();
    this.getState().setSelecting(!selecting);
    if (!selecting) document.querySelector('.leaflet-container').style.cursor = 'crosshair';
    else document.querySelector('.leaflet-container').style.cursor = '';
  }

  /**
   * This function is called when layer items are rendered.
   */
  postCreateLayerItems() {}

  /**
   * It reloads data and redraw the layer.
   */
  redraw(onlyStyle) {
    console.log('%c ...redrawing', 'color: #08ff51');
  }

  /**
   * This function is called when a custom event is invoked.
   *
   * @param {AbstractEvent} event
   */
  handleEvent(event) {}
}

export default DrawingLayerTool;
