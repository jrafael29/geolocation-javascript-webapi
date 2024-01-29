import { socketPrivateConnection } from "/shared/socketClient.js";
import { getLocation, watchLocation } from "/shared/location.js";
import { LeafletMap } from "../../shared/map.js";

function generateCoordinates(latitude, longitude) {
  // Variação máxima para simular movimentos próximos
  const variation = 0.001; // Ajuste conforme necessário

  // Gerar coordenadas
  const newLatitude = +(
    latitude +
    Math.random() * 2 * variation -
    variation
  ).toFixed(6);
  const newLongitude = +(
    longitude +
    Math.random() * 2 * variation -
    variation
  ).toFixed(6);

  return { lat: newLatitude, lng: newLongitude };
}

function mapInit({ lat, lng }) {
  const map = new LeafletMap(L);
  console.log("L", L);
  map.init({ lat, lng, viewZoom: 15 });
  map.addSelfMarker({ lat, lng });

  // for (let i = 0; i < 50; i++) {
  //   setTimeout(() => {
  //     const newCoordinates = generateCoordinates(lat, lng);
  //     map.updateSelfMarker(newCoordinates);
  //   }, i * 1000); // Cada chamada ocorre após 1 segundo multiplicado pelo índice i
  // }

  watchLocation(
    (position) => {
      const { latitude, longitude } = position.coords;
      map.updateSelfMarker({ lat: latitude, lng: longitude });
      console.log("new position:", position);
    },
    (error) => {
      console.log("deu ruim:", error);
    }
  );
}

async function mainMapPageScript() {
  const userLocation = JSON.parse(localStorage.getItem("userLocation"));
  mapInit(userLocation);
  const token = localStorage.getItem("token");

  // start websocket connection
  const socket = socketPrivateConnection({
    token: token,
  });

  console.log("map page init", token);
}
mainMapPageScript();
