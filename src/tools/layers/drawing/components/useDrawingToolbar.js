import React from 'react';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import { polygonCreate, polylineCreate } from '../util/Poly';
import { markerCreate } from '../util/Marker';

import '../style/drawingLayer.scss';

export default function useDrawingToolbar() {
  L.Control.DrawingToolbar = L.Control.extend({
    options: {
      position: 'topleft',
      drawingBtns: {},
    },
    initialize: function (options) {
      if (options) {
        L.setOptions(this, options);
      }
    },
    onAdd: function (map) {
      this.options.map = map;
      return this.createUi();
    },
    createUi: function (map) {
      const topContainer = L.DomUtil.create('div', 'drawingtoolbar');
      const toolContainer = L.DomUtil.create('div', 'leaflet-bar leaflet-control', topContainer);

      this.options.drawingBtns.lineBtn = this.createToolbarBtn(
        'lineBtn',
        toolContainer,
        'Line',
        'fa fa-minus',
      );
      this.options.drawingBtns.markerBtn = this.createToolbarBtn(
        'markerBtn',
        toolContainer,
        'Marker',
        'fa fa-map-marker',
      );
      this.options.drawingBtns.polygonBtn = this.createToolbarBtn(
        'polygonBtn',
        toolContainer,
        'Polygon',
        'fa fa-star',
      );

      this.options.drawingBtns.selectBtn = this.createToolbarBtn(
        'selectBtn',
        toolContainer,
        'Select',
        'fa fa-mouse-pointer',
      );

      this.options.drawingBtns.transformBtn = this.createToolbarBtn(
        'transformBtn',
        toolContainer,
        'Transform',
        'fa fa-arrows-alt',
      );

      this.addEventListeners();
      L.DomEvent.disableClickPropagation(topContainer);
      return topContainer;
    },

    onRemove: function (map) {},

    addEventListeners: function () {
      const { lineBtn, markerBtn, polygonBtn, selectBtn, transformBtn } = this.options.drawingBtns;
      const map = this.options.map;
      const sidebar = this.options.tool.getSidebarTabControl();

      L.DomEvent.on(lineBtn, 'click', () => polylineCreate(map, sidebar), this);
      L.DomEvent.on(markerBtn, 'click', L.DomEvent.stopPropagation)
        .on(markerBtn, 'click', L.DomEvent.preventDefault)
        .on(markerBtn, 'click', () => markerCreate(map, sidebar), this);
      L.DomEvent.on(polygonBtn, 'click', () => polygonCreate(map, sidebar), this);
      L.DomEvent.on(selectBtn, 'click', () => this.setSelecting(true), this);
      L.DomEvent.on(transformBtn, 'click', this.initTransform, this);
    },

    initTransform: function () {
      const layer = this.options.tool.getState().currEl;
      if (layer?.transform) {
        if (layer.transform._enabled) {
          layer.transform.disable();
        } else {
          layer.transform.enable({ rotation: true, scaling: true });
        }
      }
    },

    createToolbarBtn: function (className, btnContainer, title, icon) {
      const returnBtn = L.DomUtil.create('a', className, btnContainer);
      returnBtn.title = title;
      returnBtn.innerHTML = `<i class="${icon}" aria-hidden="true"></i>`;
      returnBtn.role = 'button';
      return returnBtn;
    },

    setCurrEl: function (el) {
      this.options.tool.getState().setCurrEl(el);
    },

    setSelecting: function (is) {
      this.options.tool.getState().setSelecting(is);
    },
  });

  L.control.drawingToolbar = function (options) {
    if (!options) {
      options = {};
    }
    return new L.Control.DrawingToolbar(options);
  };
}
