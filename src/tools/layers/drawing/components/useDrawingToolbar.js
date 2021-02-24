import React from "react";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import { polygonClick, polylineClick } from "../util/Poly";
import { markerClick } from "../util/Marker";

export default function useDrawingToolbar() {
  L.Control.DrawingToolbar = L.Control.extend({
    options: {
      position: "topleft",
      drawingBtns: {},
      functionBtns: {},
      additionalToolbars: {},
      currentElement: null,
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
      const topContainer = L.DomUtil.create("div", "drawingtoolbar");
      const toolContainer = L.DomUtil.create(
        "div",
        "leaflet-bar leaflet-control",
        topContainer
      );

      this.options.drawingBtns.lineBtn = this.createToolbarBtn(
        "lineBtn",
        toolContainer,
        "Line",
        "fa fa-minus"
      );
      this.options.drawingBtns.markerBtn = this.createToolbarBtn(
        "markerBtn",
        toolContainer,
        "Marker",
        "fa fa-map-marker"
      );
      this.options.drawingBtns.polygonBtn = this.createToolbarBtn(
        "polygonBtn",
        toolContainer,
        "Polygon",
        "fa fa-star"
      );

      this.addEventListeners();
      L.DomEvent.disableClickPropagation(topContainer);
      return topContainer;
    },

    onRemove: function (map) {},

    addEventListeners: function () {
      const { lineBtn, markerBtn, polygonBtn } = this.options.drawingBtns;
      const map = this.options.map;

      L.DomEvent.on(lineBtn, "click", () => polylineClick(map), this);
      L.DomEvent.on(markerBtn, "click", L.DomEvent.stopPropagation)
        .on(markerBtn, "click", L.DomEvent.preventDefault)
        .on(markerBtn, "click", () => markerClick(map), this);
      L.DomEvent.on(polygonBtn, "click", () => polygonClick(map), this);

      this.addLeafletDrawEvents();
    },

    addLeafletDrawEvents: function () {
      if (!L.Control.DrawingToolbar) {
        return;
      }
      const map = this.options.map;
      L.DomEvent.on(map, "layeradd", this.onLayerAdd, this);
      L.DomEvent.on(map, L.Draw.Event.CREATED, this.onLayerCreated, this);
    },

    onLayerAdd: function (layer) {
      console.log("added layer");
    },

    onLayerCreated: function (e) {
      this.options.currentElement = e.layer;
      console.log(e);
    },

    createToolbarBtn: function (className, btnContainer, title, icon) {
      const returnBtn = L.DomUtil.create("a", className, btnContainer);
      returnBtn.title = title;
      returnBtn.innerHTML = `<i class="${icon}" aria-hidden="true"></i>`;
      returnBtn.role = "button";
      return returnBtn;
    },
  });

  L.control.drawingToolbar = function (options) {
    if (!options) {
      options = {};
    }
    return new L.Control.DrawingToolbar(options);
  };
}
