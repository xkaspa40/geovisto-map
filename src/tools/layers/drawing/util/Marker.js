import React from 'react';
import L, { popup } from 'leaflet';
import 'leaflet-path-drag';

import 'leaflet/dist/leaflet.css';

export const iconStarter = {
  shadowUrl: null,
  iconAnchor: new L.Point(12, 12),
  iconSize: new L.Point(24, 24),
};

export const markerCreate = (map, sidebar, connectClick = false) => {
  const iconOptions = {
    ...iconStarter,
    iconUrl: sidebar.getState().getSelectedIcon(),
    connectClick,
  };
  // define custom marker
  let MyCustomMarker = L.Icon.extend({
    options: iconOptions,
  });
  const icon = new MyCustomMarker();
  icon.options = iconOptions;

  const x = new L.Draw.Marker(map, {
    icon,
    draggable: true,
    transform: true,
    // repeatMode: true,
  });
  if (x) sidebar.getState().setEnabledEl(x);
  x.enable();
  return x;
};

export const connectClick = (map, sidebar) => {
  // event.stopPropagation();
  const marker = markerCreate(map, sidebar, true);
};
