import React from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import circle from '@turf/circle';
import union from '@turf/union';
import difference from '@turf/difference';

const paintPoly = (options = {}) => {
  const _map = options.map;
  const paintBtn = L.DomUtil.create('a', options.className || '', options.btnContainer || '');
  paintBtn.title = 'Paint';
  paintBtn.innerHTML = '<i class="fa fa-paint-brush" aria-hidden="true"></i>';
  paintBtn.role = 'button';

  let _action = null;
  let _circle = null;
  let _mouseDown = false;
  let _latlng = [0, 0];
  let _circleRadius = 30;

  let _accumulatedCircles = {};
  let _coloredLayers = {};

  const stop = () => {
    _action = null;
    if (_circle) {
      _circle.remove();
    }
    _removeMouseListener();
  };

  const startPaint = () => {
    stop();
    _action = 'draw';
    _addMouseListener();
    _circle = L.circleMarker(_latlng, { color: '#333333' }).setRadius(_circleRadius).addTo(_map);
  };

  // taken from https://stackoverflow.com/questions/27545098/leaflet-calculating-meters-per-pixel-at-zoom-level
  const _pixelsToMeters = () => {
    const metersPerPixel =
      (40075016.686 * Math.abs(Math.cos((_latlng.lat * Math.PI) / 180))) /
      Math.pow(2, _map.getZoom() + 8);

    return _circleRadius * metersPerPixel;
  };

  const drawCircle = () => {
    const turfCircle = circle([_latlng.lng, _latlng.lat], _pixelsToMeters(), {
      steps: 128,
      units: 'meters',
    });

    const brushColor = '#333333';

    if (!_accumulatedCircles[brushColor]) {
      _accumulatedCircles[brushColor] = turfCircle;
    } else {
      _accumulatedCircles[brushColor] = union(_accumulatedCircles[brushColor], turfCircle);
      Object.keys(_accumulatedCircles).forEach((key) => {
        if (key !== brushColor && _accumulatedCircles[key]) {
          _accumulatedCircles[key] = difference(_accumulatedCircles[key], turfCircle);
        }
      });
    }

    // console.log({ acc: _accumulatedCircles[brushColor], turfCircle });

    Object.keys(_accumulatedCircles).forEach((key) => {
      // console.log({ _accumulatedCircles });
      let result = new L.GeoJSON(_accumulatedCircles[key], {
        color: key,
      });

      if (_coloredLayers[key] !== undefined) {
        _coloredLayers[key].remove();
      }

      _coloredLayers[key] = result.addTo(_map);
      _map.fire(L.Draw.Event.CREATED, {
        layer: _coloredLayers[key],
        layerType: 'painted',
        feature: _accumulatedCircles[key],
      });
    });
  };

  // ================= EVENT LISTENERS =================
  const _addMouseListener = () => {
    _map.on('mousemove', _onMouseMove);
    _map.on('mousedown', _onMouseDown);
    _map.on('mouseup', _onMouseUp);
  };
  const _removeMouseListener = () => {
    _map.off('mousemove', _onMouseMove);
    _map.off('mousedown', _onMouseDown);
    _map.off('mouseup', _onMouseUp);
  };
  const _onMouseDown = (event) => {
    _map.dragging.disable();
    _mouseDown = true;
    _onMouseMove(event);
  };
  const _onMouseUp = (event) => {
    _map.dragging.enable();
    _mouseDown = false;
  };
  const _onMouseMove = (event) => {
    _setLatLng(event.latlng);
    if (_mouseDown) {
      drawCircle();
    }
  };
  // ================= EVENT LISTENERS END =================

  const _setLatLng = (latlng) => {
    if (latlng !== undefined) {
      _latlng = latlng;
    }
    if (_circle) {
      _circle.setLatLng(_latlng);
    }
  };

  const _clickDraw = (event) => {
    if (event.type == 'mousedown') {
      L.DomEvent.stop(event);
      return;
    }
    if (_action == 'draw') {
      stop();
    } else {
      startPaint();
    }
  };

  L.DomEvent.on(paintBtn, 'click mousedown', _clickDraw);
  return paintBtn;
};

export default paintPoly;
