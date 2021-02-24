import L from "leaflet";
import "leaflet-path-drag";

import "leaflet/dist/leaflet.css";

export const polygonClick = (map) => {
  const x = new L.Draw.Polygon(map, {
    allowIntersection: false,
    drawError: {
      color: "#e1e100",
      message: "<strong>You cannot draw that!<strong>",
    },
    shapeOptions: {
      color: "#08aa51", // container.getSelectedColor(),
      weight: 3, // container.getSelectedStroke(),
      draggable: true,
    },
  });
  x.enable();
};

export const polylineClick = (map) => {
  const x = new L.Draw.Polyline(map, {
    shapeOptions: {
      color: "#08aa51", // container.getSelectedColor(),
      weight: 3, // container.getSelectedStroke(),
      draggable: true,
    },
  });
  x.enable();
};
