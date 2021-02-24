import React from "react";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

import "../style/drawingLayer.scss";
import { DEF_MARKER } from "../util/Marker";

export default function useEditToolbar() {
  L.Control.EditToolbar = L.Control.extend({
    options: {
      position: "topright",

      colors: ["#2ecc71", "#3498db", "#e74c3c", "#f1c40f"],
      selectedColor: "",

      strokes: [
        { label: "thin", value: 3 },
        { label: "medium", value: 5, selected: true },
        { label: "bold", value: 7 },
      ],
      selectedStroke: 5,

      iconSrcs: [
        DEF_MARKER,
        "https://icons.iconarchive.com/icons/icons-land/vista-map-markers/32/Map-Marker-Flag-1-Right-Azure-icon.png",
      ],

      selectedIconSrc: null,

      transformActive: false,

      edit: {},
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

    createUi: function () {
      const container = L.DomUtil.create(
        "div",
        "edit-toolbar leaflet-bar leaflet-control"
      );

      this.options.edit.iconToolbar = this.createIconToolbar(container);
      this.options.edit.lineToolbar = this.createLineToolbar(container);
      this.options.edit.colorToolbar = this.createColorToolbar(container);
      this.options.edit.descToolbar = this.createDescToolbar(container);

      this.addEventListeners();
      L.DomEvent.disableClickPropagation(container);

      return container;
    },
    onRemove: function (map) {},

    addEventListeners: function () {},

    createIconToolbar: function (topContainer) {
      const container = L.DomUtil.create(
        "div",
        "edit-toolbar__iconSrc",
        topContainer
      );

      L.DomEvent.disableClickPropagation(container);
      return container;
    },

    createLineToolbar: function (topContainer) {
      const container = L.DomUtil.create(
        "div",
        "edit-toolbar__line",
        topContainer
      );
      this.select = L.DomUtil.create("select", "form-control", container);

      this.options.strokes.forEach((stroke) => {
        let option = L.DomUtil.create(
          "option",
          "edit-toolbar__line-option",
          this.select
        );
        option.value = stroke.value;
        option.label = stroke.label;
        option.selected = Boolean(stroke.selected);
      });

      L.DomEvent.disableClickPropagation(container);
      return container;
    },

    createPalette: function (topContainer, clickFunc) {
      const container = L.DomUtil.create(
        "div",
        "edit-toolbar__color",
        topContainer
      );

      this.options.colors.forEach((color) => {
        let colorOption = L.DomUtil.create(
          "div",
          "edit-toolbar__color-option",
          container
        );
        colorOption.style.backgroundColor = color;
      });

      L.DomEvent.disableClickPropagation(container);
      return container;
    },

    createColorToolbar: function (topContainer) {
      const colorClicked = (color) => {};
      const container = this.createPalette(topContainer, colorClicked);
      return container;
    },

    createDescToolbar: function (topContainer) {
      const container = L.DomUtil.create(
        "form",
        "edit-toolbar__desc",
        topContainer
      );

      const heading = L.DomUtil.create(
        "h6",
        "edit-toolbar__desc-heading",
        container
      );
      heading.innerText = "Description";
      const textArea = L.DomUtil.create(
        "textarea",
        "edit-toolbar__desc-textarea",
        container
      );

      return container;
    },
  });

  L.control.editToolbar = function (options) {
    if (!options) {
      options = {};
    }
    return new L.Control.EditToolbar(options);
  };
}
