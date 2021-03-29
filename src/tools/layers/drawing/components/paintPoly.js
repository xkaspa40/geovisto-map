import React from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import circle from '@turf/circle';
import union from '@turf/union';
import difference from '@turf/difference';
import { convertOptionsToProperties, getGeoJSONFeatureFromLayer } from '../util/Poly';

const DEFAULT_COLOR = '#333333';
const DEFAULT_RADIUS = 30;

class PaintPoly {
  constructor(props) {
    this._map = null;
    this.tabState = props.tabState;

    this._action = null;
    this._circle = null;
    this._mouseDown = false;
    this._latlng = [0, 0];

    this._maxCircleRadius = 100;
    this._minCircleRadius = 10;
    this._circleRadius = DEFAULT_RADIUS;

    this.keyIndex = 0;

    this._accumulatedShapes = {};
    this._shapeLayers = {};

    this._active = false;
  }

  getMouseDown = () => {
    return this._mouseDown;
  };

  getBrushSize = () => {
    return this._circleRadius;
  };

  getBrushSizeConstraints = () => {
    return { maxBrushSize: this._maxCircleRadius, minBrushSize: this._minCircleRadius };
  };

  resizeBrush = (val) => {
    if (val && val <= this._maxCircleRadius && val >= this._minCircleRadius) {
      this._circleRadius = val;
      this._circle.setRadius(val);
    }
  };

  stop = () => {
    this._action = null;
    if (this._circle) {
      this._circle.remove();
    }
    this._removeMouseListener();
  };

  startPaint = () => {
    this.stop();
    this._action = 'draw';
    this._addMouseListener();
    this._circle = L.circleMarker(this._latlng, {
      color: DEFAULT_COLOR,
    })
      .setRadius(this._circleRadius)
      .addTo(this._map);
  };

  clearPaintedPolys = (kIdx) => {
    if (kIdx === undefined) return;

    if (this._shapeLayers[kIdx]) {
      this._shapeLayers[kIdx].remove();
      delete this._shapeLayers[kIdx];
    }
    delete this._accumulatedShapes[kIdx];
  };

  updatePaintedPolys = (kIdx, layer) => {
    if (kIdx === undefined) return;

    if (this._shapeLayers[kIdx]) {
      this._shapeLayers[kIdx] = layer;
    }
    let feature = layer.toGeoJSON();
    feature.properties = convertOptionsToProperties(layer.options);

    this._accumulatedShapes[kIdx] = feature;
  };

  // taken from https://stackoverflow.com/questions/27545098/leaflet-calculating-meters-per-pixel-at-zoom-level
  _pixelsToMeters = () => {
    const metersPerPixel =
      (40075016.686 * Math.abs(Math.cos((this._latlng.lat * Math.PI) / 180))) /
      Math.pow(2, this._map.getZoom() + 8);

    return this._circleRadius * metersPerPixel;
  };

  drawCircle = () => {
    const brushColor = this.tabState.getSelectedColor() || DEFAULT_COLOR;
    const turfCircle = circle([this._latlng.lng, this._latlng.lat], this._pixelsToMeters(), {
      steps: 16,
      units: 'meters',
    });

    if (!this._accumulatedShapes[this.keyIndex]) {
      this._accumulatedShapes[this.keyIndex] = turfCircle;
    } else {
      this._accumulatedShapes[this.keyIndex] = union(
        this._accumulatedShapes[this.keyIndex],
        turfCircle,
      );
    }

    this._accumulatedShapes[this.keyIndex].properties = { fill: brushColor };
    // console.log({
    //   accShapes: this._accumulatedShapes,
    //   shape: this._accumulatedShapes[this.keyIndex],
    //   kIdx: this.keyIndex,
    // });
    this._redrawShapes();
  };

  _redrawShapes = () => {
    Object.keys(this._accumulatedShapes).forEach((key) => {
      const coords = this._accumulatedShapes[key].geometry.coordinates;
      const latlngs = L.GeoJSON.coordsToLatLngs(coords, 1);

      let result = new L.polygon(latlngs, {
        color: this._accumulatedShapes[key]?.properties?.fill || DEFAULT_COLOR,
        draggable: true,
        transform: true,
      });

      result.dragging.disable();

      if (this._shapeLayers[key] !== undefined) {
        this._shapeLayers[key].remove();
      }

      this._shapeLayers[key] = result.addTo(this._map);
    });
  };

  _fireCreatedShapes = () => {
    // console.log('%cfired', 'color: #085f89');
    Object.keys(this._shapeLayers).forEach((key) => {
      this._map.fire(L.Draw.Event.CREATED, {
        layer: this._shapeLayers[key],
        layerType: 'painted',
        keyIndex: key,
      });
    });
  };

  // ================= EVENT LISTENERS =================
  _addMouseListener = () => {
    this._map.on('mousemove', this._onMouseMove);
    this._map.on('mousedown', this._onMouseDown);
    this._map.on('mouseup', this._onMouseUp);
  };
  _removeMouseListener = () => {
    this._map.off('mousemove', this._onMouseMove);
    this._map.off('mousedown', this._onMouseDown);
    this._map.off('mouseup', this._onMouseUp);
  };
  _onMouseDown = (event) => {
    this._map.dragging.disable();
    this._mouseDown = true;
    this._onMouseMove(event);
  };
  _onMouseUp = (event) => {
    this._map.dragging.enable();
    this._mouseDown = false;
    this.keyIndex += 1;
    this._fireCreatedShapes();
  };
  _onMouseMove = (event) => {
    this._setLatLng(event.latlng);
    if (this._mouseDown) {
      this.drawCircle();
    }
  };
  // ================= EVENT LISTENERS END =================

  _setLatLng = (latlng) => {
    if (latlng !== undefined) {
      this._latlng = latlng;
    }
    if (this._circle) {
      this._circle.setLatLng(this._latlng);
    }
  };

  _clickDraw = (event) => {
    if (event.type == 'mousedown') {
      L.DomEvent.stop(event);
      return;
    }
    if (this._action == 'draw') {
      this.stop();
      this._active = false;
    } else {
      this.startPaint();
      this._active = true;
    }
  };

  isActive = () => {
    return this._active;
  };

  renderButton = (options = {}) => {
    this._map = options.map;
    const paintBtn = L.DomUtil.create('a', options.className || '', options.btnContainer || '');
    paintBtn.title = 'Paint';
    paintBtn.innerHTML = '<i class="fa fa-paint-brush" aria-hidden="true"></i>';
    paintBtn.role = 'button';
    L.DomEvent.on(paintBtn, 'click mousedown', this._clickDraw);
    return paintBtn;
  };
}

export default PaintPoly;
