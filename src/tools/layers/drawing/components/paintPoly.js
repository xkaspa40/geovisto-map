import React from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import circle from '@turf/circle';
import union from '@turf/union';
import difference from '@turf/difference';
import { getGeoJSONFeatureFromLayer } from '../util/Poly';

const DEFAULT_COLOR = '#333333';

class PaintPoly {
  constructor(props) {
    console.log({ props });
    this._map = null;
    this.tabState = props.tabState;

    this._action = null;
    this._circle = null;
    this._mouseDown = false;
    this._latlng = [0, 0];
    this._circleRadius = 30;

    this.keyIndex = 0;

    this._accumulatedShapes = {};
    this._shapeLayers = {};
  }

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
      color: this.tabState.getSelectedColor() || DEFAULT_COLOR,
    })
      .setRadius(this._circleRadius)
      .addTo(this._map);
  };

  setAccShapes = (kIdx, layer) => {
    if (kIdx === undefined) return;

    let feat = getGeoJSONFeatureFromLayer(layer);
    const x = this._accumulatedShapes[this.keyIndex];
    if (this._shapeLayers[this.keyIndex]) {
      this._map.removeLayer(this._shapeLayers[this.keyIndex]);
      delete this._shapeLayers[this.keyIndex];
    }
    this._accumulatedShapes[this.keyIndex] = feat;
    // console.log({ feat, layer, x, shapeLayers: this._shapeLayers });
    if (this._accumulatedShapes[this.keyIndex])
      this._accumulatedShapes[this.keyIndex].properties = { fill: layer.options.color };
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
      steps: 128,
      units: 'meters',
    });

    if (!this._accumulatedShapes[this.keyIndex]) {
      this._accumulatedShapes[this.keyIndex] = turfCircle;
    } else {
      this._accumulatedShapes[this.keyIndex] = union(
        this._accumulatedShapes[this.keyIndex],
        turfCircle,
      );
      Object.keys(this._accumulatedShapes).forEach((key) => {
        if (key != this.keyIndex && this._accumulatedShapes[key]) {
          this._accumulatedShapes[key] = difference(this._accumulatedShapes[key], turfCircle);
        }
      });
    }

    this._accumulatedShapes[this.keyIndex].properties = { fill: brushColor };
    console.log({
      accShapes: this._accumulatedShapes,
      shape: this._accumulatedShapes[this.keyIndex],
      kIdx: this.keyIndex,
    });

    Object.keys(this._accumulatedShapes).forEach((key) => {
      let result = new L.GeoJSON(this._accumulatedShapes[key], {
        color: this._accumulatedShapes[key]?.properties?.fill || DEFAULT_COLOR,
      });

      if (this._shapeLayers[key] !== undefined) {
        this._shapeLayers[key].remove();
      }

      this._shapeLayers[key] = result.addTo(this._map);

      this._map.fire(L.Draw.Event.CREATED, {
        layer: this._shapeLayers[key],
        layerType: 'painted',
        feature: this._accumulatedShapes[key],
        keyIndex: this.keyIndex,
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
    } else {
      this.startPaint();
    }
  };

  _mousedownStop = (event) => {
    L.DomEvent.stop(event);
    return;
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
