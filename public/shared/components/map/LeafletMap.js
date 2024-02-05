const iconsUrl = {
  self: "https://cdn0.iconfinder.com/data/icons/map-location-solid-style/91/Map_-_Location_Solid_Style_01-512.png",
  user: "https://cdn2.iconfinder.com/data/icons/mini-icon-set-map-location/91/Location_28-512.png",
  store:
    "https://cdn1.iconfinder.com/data/icons/city-flat-2/512/urban_city_shop_sale_purchase_shopping_store-256.png",
};

export const leafletMap = new (class LeafletMap {
  #map;
  #L;
  #featureGroup;
  #selfMarker;
  #draggableMarker;
  #userGroup;
  #userMarkers = {};
  constructor(L) {
    this.#L = L;
  }

  init({ lat, lng, viewZoom = 10 }) {
    this.#map = this.#L.map("map").setView([lat, lng], viewZoom);

    this.#L
      .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png")
      .addTo(this.#map);

    this.#featureGroup = this.#L.layerGroup().addTo(this.#map);
    this.#userGroup = this.#L.layerGroup().addTo(this.#map);
  }

  addUserMarker({ lat, lng, text }) {
    const userIcon = this.#iconFactory({ iconType: "user" });
    console.log("adicionando usuario marcador", { lat, lng, text, userIcon });
    let marker = this.#L
      .marker([lat, lng], { icon: userIcon })
      .addTo(this.#userGroup)
      .bindPopup(text);

    this.#userMarkers[text] = marker;
  }

  updateUserMarker({ lat, lng, identifier }) {
    this.removeUserMarker({ identifier });
    this.addUserMarker({ lat, lng, text: identifier });
  }

  removeUserMarker({ identifier }) {
    const marker = this.#userMarkers[identifier];
    if (marker) this.#userGroup.removeLayer(marker);
  }

  addSelfMarker({ lat, lng, identifier }) {
    this.#selfMarker = this.#L
      .marker([lat, lng])
      .addTo(this.#featureGroup)
      .bindPopup(`Você está aqui, ${identifier}`)
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

  #iconFactory({ iconType }) {
    const icon = this.#L.icon({
      iconUrl: iconsUrl[iconType],
      iconSize: [38, 38],
    });
    return icon;
  }
})(L);

// export const map = new LeafletMap();
