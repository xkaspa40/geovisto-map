import React from 'react';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import { normalStyles, polygonCreate, polylineCreate, slicePoly } from '../util/Poly';
import { connectClick, markerCreate } from '../util/Marker';

import '../style/drawingLayer.scss';
import paintPoly from './paintPoly';

import '../components/Edit';

import * as turf from '@turf/turf';

const UNABLE_TO_CLICK_DISABLE = ['lineBtn', 'markerBtn', 'polygonBtn'];

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
      toolContainer.style.cursor = 'pointer';

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

      this.options.drawingBtns.deselectBtn = this.createToolbarBtn(
        'deselectBtn',
        toolContainer,
        'Deselect',
        'fa fa-star-half-o',
      );

      this.options.drawingBtns.transformBtn = this.createToolbarBtn(
        'transformBtn',
        toolContainer,
        'Transform',
        'fa fa-arrows-alt',
      );

      this.options.drawingBtns.editBtn = this.createToolbarBtn(
        'editBtn',
        toolContainer,
        'Edit',
        'fa fa-square',
      );

      this.options.drawingBtns.sliceBtn = this.createToolbarBtn(
        'sliceBtn',
        toolContainer,
        'Slice polygon',
        'fa fa-cutlery',
      );

      this.options.drawingBtns.connectBtn = this.createToolbarBtn(
        'connectBtn',
        toolContainer,
        'Connect',
        'fa fa-sitemap',
      );

      this.options.drawingBtns.searchBtn = this.createToolbarBtn(
        'searchBtn',
        toolContainer,
        'Search',
        'fa fa-search',
      );

      const sidebar = this.options.tool.getSidebarTabControl();

      this.options.drawingBtns.paintBtn = sidebar.getState().paintPoly.renderButton({
        className: 'paintBtn',
        btnContainer: toolContainer,
        map: this.options.map,
      });

      this.addEventListeners();
      L.DomEvent.disableClickPropagation(topContainer);
      return topContainer;
    },

    onRemove: function (map) {},

    _dispatchClickEvent: function (btn, sidebar) {
      let enabled = sidebar.getState().getEnabledEl();
      console.log({ enabled });
      if (enabled) {
        enabled.disable();
      }
      // else if (this.lastClickedBtn && btn !== this.lastClickedBtn) {
      //   let className = this.lastClickedBtn.className;
      //   if (UNABLE_TO_CLICK_DISABLE.includes(className)) {
      //     this.lastClickedBtn = btn;
      //     return;
      //   }
      //   if (className === 'selectBtn' && !this.getSelecting()) {
      //     this.lastClickedBtn = btn;
      //     return;
      //   }
      //   this.lastClickedBtn.dispatchEvent(new Event('click'));
      // }
      // this.lastClickedBtn = btn;
    },

    _disableTransform: function () {
      const layer = this.getCurrEl();

      if (layer?.transform?._enabled) {
        layer.transform.disable();
        layer.dragging.disable();
        let paintPoly = this.options.tool.getSidebarTabControl().getState().paintPoly;
        paintPoly.updatePaintedPolys(layer.kIdx, layer);
      }
    },

    addEventListeners: function () {
      const {
        lineBtn,
        markerBtn,
        polygonBtn,
        selectBtn,
        transformBtn,
        editBtn,
        sliceBtn,
        deselectBtn,
        connectBtn,
        searchBtn,
      } = this.options.drawingBtns;
      const map = this.options.map;
      const sidebar = this.options.tool.getSidebarTabControl();

      // TODO: think of better solution
      const btnsArr = Object.values(this.options.drawingBtns);
      btnsArr.forEach((btn) => {
        if (btn.className !== 'transformBtn') {
          L.DomEvent.on(btn, 'click', this._disableTransform, this);
        }
      });

      L.DomEvent.on(lineBtn, 'click', () => this.initCreatePolyline(map, sidebar), this);
      L.DomEvent.on(markerBtn, 'click', L.DomEvent.stopPropagation)
        .on(markerBtn, 'click', L.DomEvent.preventDefault)
        .on(markerBtn, 'click', () => this.initCreateMarker(map, sidebar), this);
      L.DomEvent.on(polygonBtn, 'click', () => this.initCreatePolygon(map, sidebar), this);
      L.DomEvent.on(selectBtn, 'click', this.initSelecting, this);
      L.DomEvent.on(transformBtn, 'click', this.initTransform, this);
      L.DomEvent.on(editBtn, 'click', this.initNodeEdit, this);
      L.DomEvent.on(sliceBtn, 'click', () => this.initSlicePoly(map, sidebar), this);
      L.DomEvent.on(deselectBtn, 'click', this.deselect, this);
      L.DomEvent.on(connectBtn, 'click', L.DomEvent.stopPropagation)
        .on(connectBtn, 'click', L.DomEvent.preventDefault)
        .on(connectBtn, 'click', () => connectClick(map, sidebar), this);
      L.DomEvent.on(searchBtn, 'click', this.initSearch, this);
    },

    initSearch: function () {
      this.options.tool.search();
    },

    initCreatePolyline: function (map, sidebar) {
      let enabled = sidebar.getState().getEnabledEl();
      if (enabled?.layerType === 'polyline') this._dispatchClickEvent(map, sidebar);
      else polylineCreate(map, sidebar);
    },
    initCreatePolygon: function (map, sidebar) {
      let enabled = sidebar.getState().getEnabledEl();
      console.log({ enab: enabled });
      if (enabled?.layerType === 'polygon') this._dispatchClickEvent(map, sidebar);
      else polygonCreate(map, sidebar);
    },
    initCreateMarker: function (map, sidebar) {
      let enabled = sidebar.getState().getEnabledEl();
      if (enabled?.layerType === 'marker') this._dispatchClickEvent(map, sidebar);
      else markerCreate(map, sidebar);
    },
    initSlicePoly: function (map, sidebar) {
      let enabled = sidebar.getState().getEnabledEl();
      if (enabled?.layerType === 'knife') this._dispatchClickEvent(map, sidebar);
      else slicePoly(map, sidebar);
    },

    deselect: function () {
      const currEl = this.getCurrEl();
      console.log({ currEl });

      if (currEl?.editing?._enabled) {
        currEl.editing.disable();
      }
      let selected = this.options.tool.getState().selectedLayer;
      if (selected) {
        if (selected.setStyle) selected.setStyle(normalStyles);
        this.options.tool.getState().clearSelectedLayer();
        this.options.tool.redrawSidebarTabControl();
        this.setCurrEl(null);
        document.querySelector('.leaflet-container').style.cursor = '';
      }
    },

    initNodeEdit: function () {
      const currEl = this.getCurrEl();

      if (currEl.editing) {
        // currEl.editing = new L.Edit.ExtendedPoly(currEl);
        if (currEl.editing._enabled) {
          currEl.editing.disable();
          // let paintPoly = this.options.tool.getSidebarTabControl().getState().paintPoly;
          // paintPoly.updatePaintedPolys(layer.kIdx, layer);
        } else {
          currEl.editing.enable();
        }
      }
    },

    initTransform: function () {
      const currEl = this.getCurrEl();

      this.options.tool.initTransform(currEl);
    },

    initSelecting: function () {
      const selecting = this.getSelecting();
      this.setSelecting(!selecting);
      if (!selecting) document.querySelector('.leaflet-container').style.cursor = 'crosshair';
      else document.querySelector('.leaflet-container').style.cursor = '';

      // this.options.map.on('click', () => {
      //   const sidebar = this.options.tool.getSidebarTabControl();
      //   if (Boolean(sidebar.getState().enabledEl) || !this.getSelecting()) return;
      //   let selected = this.options.tool.getState().selectedLayer;
      //   if (selected) {
      //     if (selected.setStyle) selected.setStyle(normalStyles);
      //     this.options.tool.getState().clearSelectedLayer();
      //     this.options.tool.redrawSidebarTabControl();
      //     this.setCurrEl(null);
      //     document.querySelector('.leaflet-container').style.cursor = '';
      //   }
      // });
    },

    createToolbarBtn: function (className, btnContainer, title, icon) {
      const returnBtn = L.DomUtil.create('a', className, btnContainer);
      returnBtn.title = title;
      returnBtn.innerHTML = `<i class="${icon}" aria-hidden="true"></i>`;
      returnBtn.role = 'button';
      return returnBtn;
    },

    getCurrEl: function () {
      return this.options.tool.getState().currEl;
    },

    setCurrEl: function (el) {
      this.options.tool.getState().setCurrEl(el);
    },

    setSelecting: function (is) {
      this.options.tool.getState().setSelecting(is);
    },

    getSelecting: function () {
      return this.options.tool.getState().getSelecting();
    },
  });

  L.control.drawingToolbar = function (options) {
    if (!options) {
      options = {};
    }
    return new L.Control.DrawingToolbar(options);
  };
}
