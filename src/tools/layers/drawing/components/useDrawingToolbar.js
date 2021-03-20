import React from 'react';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import { normalStyles, polygonCreate, polylineCreate, slicePoly } from '../util/Poly';
import { markerCreate } from '../util/Marker';

import '../style/drawingLayer.scss';
import paintPoly from './paintPoly';

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
      let enabled = sidebar.getState().enabledEl;
      if (enabled) {
        enabled.disable();
      } else if (this.lastClickedBtn && btn !== this.lastClickedBtn) {
        let className = this.lastClickedBtn.className;
        if (UNABLE_TO_CLICK_DISABLE.includes(className)) {
          this.lastClickedBtn = btn;
          return;
        }
        if (className === 'selectBtn' && !this.getSelecting()) {
          this.lastClickedBtn = btn;
          return;
        }
        this.lastClickedBtn.dispatchEvent(new Event('click'));
      }
      this.lastClickedBtn = btn;
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
      } = this.options.drawingBtns;
      const map = this.options.map;
      const sidebar = this.options.tool.getSidebarTabControl();

      // TODO: think of better solution
      // const btnsArr = Object.values(this.options.drawingBtns);
      // btnsArr.forEach((btn) => {
      //   L.DomEvent.on(btn, 'click', () => this._dispatchClickEvent(btn, sidebar), this);
      // });

      L.DomEvent.on(lineBtn, 'click', () => polylineCreate(map, sidebar), this);
      L.DomEvent.on(markerBtn, 'click', L.DomEvent.stopPropagation)
        .on(markerBtn, 'click', L.DomEvent.preventDefault)
        .on(markerBtn, 'click', () => markerCreate(map, sidebar), this);
      L.DomEvent.on(polygonBtn, 'click', () => polygonCreate(map, sidebar), this);
      L.DomEvent.on(selectBtn, 'click', this.initSelecting, this);
      L.DomEvent.on(transformBtn, 'click', this.initTransform, this);
      L.DomEvent.on(editBtn, 'click', this.initNodeEdit, this);
      L.DomEvent.on(sliceBtn, 'click', () => slicePoly(map, sidebar), this);
    },

    initNodeEdit: function () {
      const currEl = this.options.tool.getState().currEl;
      console.log({ currEl });
      if (currEl.editing) {
        if (currEl.editing._enabled) {
          currEl.editing.disable();
          // let paintPoly = this.options.tool.getSidebarTabControl().getState().paintPoly;
          // paintPoly.updatePaintedPolys(layer.kIdx, layer);
        } else {
          currEl.editing.enable();
        }
      }
    },

    initSelecting: function () {
      const selecting = this.getSelecting();
      this.setSelecting(!selecting);
      if (!selecting) document.querySelector('.leaflet-container').style.cursor = 'crosshair';
      else document.querySelector('.leaflet-container').style.cursor = '';

      this.options.map.on('click', () => {
        const sidebar = this.options.tool.getSidebarTabControl();
        if (Boolean(sidebar.getState().enabledEl) || !this.getSelecting()) return;
        let selected = this.options.tool.getState().selectedLayer;
        if (selected) {
          if (selected.setStyle) selected.setStyle(normalStyles);
          this.options.tool.getState().clearSelectedLayer();
          this.options.tool.redrawSidebarTabControl();
          this.setCurrEl(null);
          document.querySelector('.leaflet-container').style.cursor = '';
        }
      });
    },

    initTransform: function () {
      const layer = this.options.tool.getState().currEl;
      if (layer?.transform) {
        if (layer.transform._enabled) {
          layer.transform.disable();
          layer.dragging.disable();
          let paintPoly = this.options.tool.getSidebarTabControl().getState().paintPoly;
          paintPoly.updatePaintedPolys(layer.kIdx, layer);
        } else {
          layer.transform.enable({ rotation: true, scaling: true });
          layer.dragging.enable();
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

    getSelecting: function (is) {
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
