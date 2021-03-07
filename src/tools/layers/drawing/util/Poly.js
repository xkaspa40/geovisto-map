import L from 'leaflet';
import 'leaflet-path-drag';
import 'leaflet-path-transform';

import 'leaflet/dist/leaflet.css';

export const highlightStyles = { fillOpacity: 0.5, opacity: 0.2 };
export const normalStyles = { fillOpacity: 0.2, opacity: 0.5 };

export const polygonCreate = (map, sidebar) => {
  const x = new L.Draw.Polygon(map, {
    allowIntersection: false,
    drawError: {
      color: '#e1e100',
      message: '<strong>You cannot draw that!<strong>',
    },
    shapeOptions: {
      color: sidebar.getState().getSelectedColor(),
      weight: sidebar.getState().getSelectedStroke(),
      draggable: true,
      transform: true,
    },
  });
  sidebar.getState().setEnabledEl(x);
  x.enable();
  return x;
};

export const polylineCreate = (map, sidebar) => {
  const x = new L.Draw.Polyline(map, {
    shapeOptions: {
      color: sidebar.getState().getSelectedColor(),
      weight: sidebar.getState().getSelectedStroke(),
      draggable: true,
      transform: true,
    },
  });
  x.enable();
  sidebar.getState().setEnabledEl(x);
  return x;
};

export const getGeoJSONFeatureFromLayer = (layer) => {
  let geoFeature = layer.toGeoJSON();
  let feature = geoFeature.type === 'FeatureCollection' ? geoFeature.features[0] : geoFeature;
  return feature;
};
