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
