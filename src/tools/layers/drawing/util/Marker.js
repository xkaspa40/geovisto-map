import React from 'react';
import L, { popup } from 'leaflet';
import 'leaflet-path-drag';

import 'leaflet/dist/leaflet.css';
import { ICON_SRCS } from '../sidebar/DrawingLayerToolTabControlState';
import { OpenStreetMapProvider } from 'leaflet-geosearch';

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
  const marker = markerCreate(map, sidebar, true);
};

export const putMarkerOnMap = (featureGroup, latlng, popup, icon) => {
  const iconOptions = {
    ...iconStarter,
    iconUrl: icon || ICON_SRCS[0],
  };
  let MyCustomMarker = L.Icon.extend({
    options: iconOptions,
  });

  let marker = new L.Marker.Touch(latlng, { icon: new MyCustomMarker() });
  if (popup) {
    marker.bindPopup(popup);
    marker.popupContent = popup;
  }

  marker.layerType = 'marker';
  featureGroup.addLayer(marker);
  // marker.addTo(map);
  // map.fire(L.Draw.Event.CREATED, { layer: marker, layerType: 'marker' });
};

export const geoSearch = async (featureGroup, query = '') => {
  if (!query) return;

  // setup
  const provider = new OpenStreetMapProvider();
  // let latlng = L.latLng(0, 0);

  // search
  const results = await provider.search({ query });
  console.log({ results });
  // const res = results[0];
  // // console.log(res);
  // latlng.lat = res?.y || 0;
  // latlng.lng = res?.x || 0;

  // if (res?.label) {
  //   putMarkerOnMap(featureGroup, latlng, res.label);
  // }
  return results;
};
