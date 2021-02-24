import React from "react";
import L, { popup } from "leaflet";
import "leaflet-path-drag";

import "leaflet/dist/leaflet.css";

export const iconStarter = {
  shadowUrl: null,
  iconAnchor: new L.Point(12, 12),
  iconSize: new L.Point(24, 24),
};

export const DEF_MARKER =
  "https://upload.wikimedia.org/wikipedia/commons/0/0a/Marker_location.png";

export const markerClick = (map, connectClick = false) => {
  const iconOptions = {
    ...iconStarter,
    iconUrl: DEF_MARKER, // container.getSelectedIconSrc(),
    connectClick,
  };
  // define custom marker
  let MyCustomMarker = L.Icon.extend({
    options: iconOptions,
  });

  const x = new L.Draw.Marker(map, {
    icon: new MyCustomMarker(),
    draggable: true,
  });
  x.enable();
  return x;
};
