import { leafletMap } from "/shared/components/map/LeafletMap.js";

export const leafletMarkerFactory = new (class LeafletMarkerFactory {
  #map;
  constructor() {
    this.#map = leafletMap;
  }

  makeDraggable({ lat, lng, cbDragend }) {
    this.#map.addDraggableMarker({ lat, lng, cbDragend });
  }
})();
