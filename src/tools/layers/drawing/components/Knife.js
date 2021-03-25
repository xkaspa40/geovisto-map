import L from 'leaflet';
import 'leaflet-draw';

L.Draw.Slice = L.Draw.Polyline.extend({
  statics: {
    TYPE: 'knife',
  },
  // @method initialize(): void
  initialize: function (map, options) {
    // if touch, switch to touch icon
    if (L.Browser.touch) {
      this.options.icon = this.options.touchIcon;
    }

    // Need to set this here to ensure the correct message is used.
    this.options.drawError.message = L.drawLocal.draw.handlers.polyline.error;

    // Merge default drawError options with custom options
    if (options && options.drawError) {
      options.drawError = L.Util.extend({}, this.options.drawError, options.drawError);
    }

    // Save the type so super can fire, need to do this as cannot do this.TYPE :(
    this.type = L.Draw.Slice.TYPE;

    L.Draw.Feature.prototype.initialize.call(this, map, options);
  },
  _calculateFinishDistance: function (potentialLatLng) {
    var lastPtDistance;
    if (this._markers.length > 0) {
      var finishMarker;
      if (this.type === L.Draw.Polyline.TYPE || this.type === L.Draw.Slice.TYPE) {
        finishMarker = this._markers[this._markers.length - 1];
      } else if (this.type === L.Draw.Polygon.TYPE) {
        finishMarker = this._markers[0];
      } else {
        return Infinity;
      }
      var lastMarkerPoint = this._map.latLngToContainerPoint(finishMarker.getLatLng()),
        potentialMarker = new L.Marker(potentialLatLng, {
          icon: this.options.icon,
          zIndexOffset: this.options.zIndexOffset * 2,
        });
      var potentialMarkerPint = this._map.latLngToContainerPoint(potentialMarker.getLatLng());
      lastPtDistance = lastMarkerPoint.distanceTo(potentialMarkerPint);
    } else {
      lastPtDistance = Infinity;
    }
    return lastPtDistance;
  },
});
