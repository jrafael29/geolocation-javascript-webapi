export const leafletMap = new (class LeafletMap {
  #map;
  #L;
  #featureGroup;
  #selfMarker;
  #draggableMarker;
  constructor(L) {
    this.#L = L;
  }

  addSelfMarker({ lat, lng, text = "Você está aqui" }) {
    this.#selfMarker = this.#L
      .marker([lat, lng])
      .addTo(this.#featureGroup)
      .bindPopup(text)
      .openPopup();
  }
  updateSelfMarker({ lat, lng }) {
    this.#featureGroup.removeLayer(this.#selfMarker);
    this.addSelfMarker({ lat, lng });
  }

  addDraggableMarker({ lat, lng, cbDragend }) {
    if (!this.#draggableMarker)
      this.#draggableMarker = this.#L
        .marker([lat, lng], { draggable: true })
        .addTo(this.#featureGroup)
        .on("dragend", cbDragend)
        .on("dblclick", () => {
          console.log("double");
          this.removeDraggableMarker();
        });
  }
  removeDraggableMarker() {
    this.#featureGroup.removeLayer(this.#draggableMarker);
    this.#draggableMarker = null;
  }

  init({ lat, lng, viewZoom = 10 }) {
    this.#map = this.#L.map("map").setView([lat, lng], viewZoom);

    this.#L
      .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png")
      .addTo(this.#map);

    this.#featureGroup = this.#L.layerGroup().addTo(this.#map);
  }
})(L);

// export const map = new LeafletMap();
