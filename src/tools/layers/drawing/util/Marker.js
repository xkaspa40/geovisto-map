import React from 'react';
import L, { popup } from 'leaflet';
import 'leaflet-path-drag';

import 'leaflet/dist/leaflet.css';
import { ICON_SRCS } from '../sidebar/DrawingLayerToolTabControlState';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { MapLayerTool } from '../../map';

export const iconStarter = {
  shadowUrl: null,
  iconAnchor: new L.Point(12, 12),
  iconSize: new L.Point(24, 24),
};

// * opted for this approach instead of extending L.Icon
// * it led to some bugs/errors and this way we have an access to icon options
const iconOptions = {
  ...iconStarter,
};

export const markerCreate = (map, sidebar, connectClick = false) => {
  const additionalOpts = { iconUrl: sidebar.getState().getSelectedIcon(), connectClick };
  const icon = new L.Icon({ ...iconOptions, ...additionalOpts });

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
  const marker = markerCreate(map, sidebar, true);
};

export const putMarkerOnMap = (featureGroup, latlng, popup, iconUrl, connectClick = false) => {
  const additionalOpts = { iconUrl: iconUrl || ICON_SRCS[0], connectClick };
  const icon = new L.Icon({
    ...iconOptions,
    ...additionalOpts,
  });

  let marker = new L.Marker.Touch(latlng, { icon });
  if (popup) {
    marker.bindPopup(popup);
    marker.popupContent = popup;
  }

  marker.layerType = 'marker';
  console.log({ marker });
  featureGroup.addLayer(marker);
  // map.fire(L.Draw.Event.CREATED, { layer: marker, layerType: 'marker' });
  return marker;
};

export const geoSearch = async (featureGroup, query = '') => {
  if (!query) return;

  // setup
  const provider = new OpenStreetMapProvider();

  // search
  const results = await provider.search({ query });

  return results;
};
