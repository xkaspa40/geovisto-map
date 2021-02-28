import React from 'react';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import { polygonClick, polylineClick } from '../util/Poly';
import { markerClick } from '../util/Marker';

export default function useDrawingToolbar() {
  L.Control.DrawingToolbar = L.Control.extend({
    options: {
      position: 'topleft',
      drawingBtns: {},
      functionBtns: {},
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

      this.addEventListeners();
      L.DomEvent.disableClickPropagation(topContainer);
      return topContainer;
    },

    onRemove: function (map) {},

    addEventListeners: function () {
      const { lineBtn, markerBtn, polygonBtn } = this.options.drawingBtns;
      const map = this.options.map;
      const sidebar = this.options.tool.getSidebarTabControl();

      L.DomEvent.on(lineBtn, 'click', () => polylineClick(map, sidebar), this);
      L.DomEvent.on(markerBtn, 'click', L.DomEvent.stopPropagation)
        .on(markerBtn, 'click', L.DomEvent.preventDefault)
        .on(markerBtn, 'click', () => markerClick(map, sidebar), this);
      L.DomEvent.on(polygonBtn, 'click', () => polygonClick(map, sidebar), this);

      this.addLeafletDrawEvents();
    },

    addLeafletDrawEvents: function () {
      if (!L.Control.DrawingToolbar) {
        return;
      }
      const map = this.options.map;
      L.DomEvent.on(map, 'layeradd', this.onLayerAdd, this);
      L.DomEvent.on(map, L.Draw.Event.CREATED, this.onLayerCreated, this);
    },

    onLayerAdd: function (layer) {
      console.log('added layer');
    },

    onLayerCreated: function (e) {
      this.setCurrEl(e.layer);
      this.options.tool.redrawSidebarTabControl(e.layerType);
      this.applyEventListenerForStyleChange(e.layer);
      // console.log(e);
    },

    applyEventListenerForStyleChange: function (layer) {
      let evt = L.DomEvent.on(layer, 'click', this.initChangeStyle, this);
      // this.showEditToolbar();
    },

    initChangeStyle: function (e) {
      const drawObject = e.target;
      this.setCurrEl(drawObject);
      this.options.tool.redrawSidebarTabControl(e.target.layerType);
    },

    createToolbarBtn: function (className, btnContainer, title, icon) {
      const returnBtn = L.DomUtil.create('a', className, btnContainer);
      returnBtn.title = title;
      returnBtn.innerHTML = `<i class="${icon}" aria-hidden="true"></i>`;
      returnBtn.role = 'button';
      return returnBtn;
    },

    setCurrEl: function (el) {
      this.options.tool.getState().currEl = el;
    },
  });

  L.control.drawingToolbar = function (options) {
    if (!options) {
      options = {};
    }
    return new L.Control.DrawingToolbar(options);
  };
}
