import L from 'leaflet';
import 'leaflet-draw';

L.Edit.ExtendedPoly = L.Edit.Poly.extend({
  _initHandlers: function () {
    this._verticesHandlers = [];
    for (var i = 0; i < this.latlngs.length; i++) {
      this._verticesHandlers.push(
        new L.Edit.ReducedPolyVerticesEdit(this._poly, this.latlngs[i], this._poly.options.poly),
      );
    }
  },
});

L.Edit.ReducedPolyVerticesEdit = L.Edit.PolyVerticesEdit.extend({
  _initMarkers: function () {
    if (!this._markerGroup) {
      this._markerGroup = new L.LayerGroup();
    }
    this._markers = [];

    var latlngs = this._defaultShape(),
      i,
      j,
      len,
      marker;

    // const DECIMAL_PLACE = 4;
    // const TRESHOLD = 0.5;
    // const res = new Set();
    // for (let index = 0; index < latlngs.length; index++) {
    //   let currIdx = index;
    //   let prevIdx = index - 1;
    //   if (prevIdx !== -1) {
    //     let currEl = latlngs[currIdx];
    //     let prevEl = latlngs[prevIdx];
    //     let prevLat = Number(prevEl.lat.toFixed(DECIMAL_PLACE));
    //     let currLat = Number(currEl.lat.toFixed(DECIMAL_PLACE));
    //     let prevLng = Number(prevEl.lng.toFixed(DECIMAL_PLACE));
    //     let currLng = Number(currEl.lng.toFixed(DECIMAL_PLACE));
    //     let timesLat = (prevLat > 0 && currLat > 0) || (prevLat < 0 && currLat < 0) ? -1 : 1;
    //     let timesLng = (prevLng > 0 && currLng > 0) || (prevLng < 0 && currLng < 0) ? -1 : 1;
    //     let diffLats = currLat + prevLat * timesLat;
    //     let diffLngs = currLng + prevLng * timesLng;
    //     if (diffLats < 0) diffLats = diffLats * -1;
    //     if (diffLngs < 0) diffLngs = diffLngs * -1;
    //     if (diffLats > TRESHOLD && diffLngs > TRESHOLD) {
    //       let temp = L.latLng(currEl.lat, currEl.lng);
    //       res.add(temp);
    //     }
    //   }
    // }
    // latlngs = Array.from(res);

    console.log({ latlngs, shape: this._defaultShape() });

    for (i = 0, len = latlngs.length; i < len; i++) {
      marker = this._createMarker(latlngs[i], i);
      marker.on('click', this._onMarkerClick, this);
      marker.on('contextmenu', this._onContextMenu, this);
      this._markers.push(marker);
    }

    var markerLeft, markerRight;

    for (i = 0, j = len - 1; i < len; j = i++) {
      if (i === 0 && !(L.Polygon && this._poly instanceof L.Polygon)) {
        continue;
      }

      markerLeft = this._markers[j];
      markerRight = this._markers[i];

      this._createMiddleMarker(markerLeft, markerRight);
      this._updatePrevNext(markerLeft, markerRight);
    }
  },
});
