import { leafletMap } from "/shared/components/map/LeafletMap.js";
import { FormAddLocation } from "/shared/components/on-map/FormAddLocation.js";
import { TopRightSectionComponent } from "/shared/components/on-map/TopRightSectionComponent.js";
import { storagedKeys } from "/shared/storagedKeys.js";
import { socketPrivateConnection } from "/shared/socketClient.js";

function mapInit({ lat, lng }) {
  leafletMap.init({ lat, lng, viewZoom: 15 });
  leafletMap.addSelfMarker({ lat, lng });
  // for (let i = 0; i < 50; i++) {
  //   setTimeout(() => {
  //     const newCoordinates = generateCoordinates(lat, lng);
  //     map.updateSelfMarker(newCoordinates);
  //   }, i * 1000); // Cada chamada ocorre após 1 segundo multiplicado pelo índice i
  // }

  // watchLocation(
  //   (position) => {
  //     const { latitude, longitude } = position.coords;
  //     map.updateSelfMarker({ lat: latitude, lng: longitude });
  //     console.log("new position:", position);
  //   },
  //   (error) => {
  //     console.log("deu ruim:", error);
  //   }
  // );
}

function clearStorage() {
  Object.values(storagedKeys).forEach((key) => {
    localStorage.removeItem(key);
  });
}

async function mainMapPageScript() {
  clearStorage();
  const userLocation = JSON.parse(localStorage.getItem("userLocation"));
  mapInit(userLocation);
  new TopRightSectionComponent(new FormAddLocation());

  const token = localStorage.getItem("token");
  // start websocket connection
  socketPrivateConnection({
    token: token,
  });

  // console.log("map page init", token);
}
mainMapPageScript();
