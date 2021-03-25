import L from 'leaflet';
import 'leaflet-path-drag';
import 'leaflet-path-transform';

import 'leaflet/dist/leaflet.css';

import { STROKES, COLORS } from '../sidebar/DrawingLayerToolTabControlState';

import '../components/Knife';
import '../components/Edit';

import * as turf from '@turf/turf';

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

export const slicePoly = (map, sidebar) => {
  const x = new L.Draw.Slice(map, {
    shapeOptions: {
      color: '#333',
      weight: 3,
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

export const featureToLeafletCoordinates = (featureCoordinates, type = 'Polygon') => {
  let point;
  if (type === 'Point') {
    point = L.latLng(featureCoordinates.reverse());
    if (point) {
      featureCoordinates = [point.lng, point.lat];
    }
    return featureCoordinates;
  } else if (type === 'LineString') {
    for (let i = 0; i < featureCoordinates.length; i++) {
      point = L.latLng(featureCoordinates[i]);
      if (point) {
        featureCoordinates[i] = [point.lng, point.lat];
      }
    }
    return featureCoordinates;
  } else if (type === 'Polygon') {
    for (let i = 0; i < featureCoordinates.length; i++) {
      for (let j = 0; j < featureCoordinates[i].length; j++) {
        point = L.latLng(featureCoordinates[i][j]);
        if (point) {
          featureCoordinates[i][j] = [point.lng, point.lat];
        }
      }
    }
  }

  return featureCoordinates;
};

export const getLeafletTypeFromFeature = (feature) => {
  switch (feature?.geometry?.type) {
    case 'Polygon':
      return 'polygon';
    case 'LineString':
      return 'polyline';
    case 'Point':
      return 'marker';
    default:
      return '';
  }
};

export const convertPropertiesToOptions = (properties) => {
  let options = { draggable: true, transform: true };
  options.weight = properties['stroke-width'] || STROKES[1].value;
  options.color = properties['fill'] || COLORS[0];
  options.fillOpacity = properties['fill-opacity'] || normalStyles.fillOpacity;
  options.opacity = properties['stroke-opacity'] || normalStyles.opacity;

  return options;
};

export const convertOptionsToProperties = (options) => {
  let properties = { draggable: true, transform: true };
  properties['stroke-width'] = options.weight || STROKES[1].value;
  properties['fill'] = options.color || COLORS[0];
  properties['fill-opacity'] = normalStyles.fillOpacity;
  properties['stroke-opacity'] = normalStyles.opacity;

  return properties;
};

export const getUnkinkedFeatFromLayer = (layer) => {
  if (!layer) return null;
  let drawnGeoJSON = layer.toGeoJSON();
  let unkinked = turf.unkinkPolygon(drawnGeoJSON);
  let feature = unkinked.type === 'FeatureCollection' ? unkinked.features : unkinked;
  return feature;
};

export const isFeaturePoly = (feature) => {
  console.log({ feature });
  if (!feature) return false;
  if (feature?.type === 'FeatureCollection') {
    let f = feature.features[0];
    return f?.geometry?.type === 'Polygon' || f?.geometry?.type === 'MultiPolygon';
  }
  return feature?.geometry?.type === 'Polygon' || feature?.geometry?.type === 'MultiPolygon';
};
