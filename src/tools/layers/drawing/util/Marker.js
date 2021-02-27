import React from 'react';
import L, { popup } from 'leaflet';
import 'leaflet-path-drag';

import 'leaflet/dist/leaflet.css';

export const iconStarter = {
  shadowUrl: null,
  iconAnchor: new L.Point(12, 12),
  iconSize: new L.Point(24, 24),
};

export const markerClick = (map, sidebar) => {
  const iconOptions = {
    ...iconStarter,
    iconUrl: sidebar.getState().getSelectedIcon(),
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
