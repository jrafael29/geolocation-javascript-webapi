// export class LeafletMap {
//   #map;
//   #L;
//   #selfFeatureGroup;
//   #selfMarker;
//   constructor(L) {
//     this.#L = L;
//   }

//   addSelfMarker({ lat, lng, text = "Você está aqui" }) {
//     this.#selfMarker = this.#L
//       .marker([lat, lng])
//       .addTo(this.#selfFeatureGroup)
//       .bindPopup(text)
//       .openPopup();
//   }
//   updateSelfMarker({ lat, lng }) {
//     this.#selfFeatureGroup.removeLayer(this.#selfMarker);
//     this.addSelfMarker({ lat, lng });
//   }

//   init({ lat, lng, viewZoom = 10 }) {
//     this.#map = this.#L.map("map").setView([lat, lng], viewZoom);

//     this.#L
//       .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png")
//       .addTo(this.#map);

//     this.#selfFeatureGroup = this.#L.layerGroup().addTo(this.#map);
//   }
// }

// // export const map = new LeafletMap();
