import { leafletMap } from "/shared/components/map/LeafletMap.js";
import { FormAddLocation } from "/shared/components/on-map/children/FormAddLocation.js";
import { TopRightSectionComponent } from "/shared/components/on-map/TopRightSectionComponent.js";
import { storagedKeys } from "/shared/storagedKeys.js";
import { socketPrivateConnection } from "/shared/socketClient.js";
import { BottomRightSectionComponent } from "/shared/components/on-map/BottomRightSectionComponent.js";
import { ListUserLocation } from "../../shared/components/on-map/children/ListUserLocation.js";

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
  const identifier = JSON.parse(
    localStorage.getItem(storagedKeys.userIdentifier)
  );
  clearStorage();
  const userLocation = JSON.parse(localStorage.getItem("userLocation"));
  mapInit(userLocation);
  new TopRightSectionComponent(new FormAddLocation());

  const token = localStorage.getItem("token");
  // start websocket connection
  const socket = socketPrivateConnection({
    token: token,
  });

  socket.emit("user-join", {
    identifier: identifier,
    lat: userLocation.lat,
    lng: userLocation.lng,
  });
  socket.on("disconnect", () => {
    socket.emit("user-left", userLocation);
  });
  socket.on("user-left", (data) => {
    console.log("user left");
    // console.log("user has lefted", data);
    socket.emit("users-location", {
      identifier: identifier,
      lat: userLocation.lat,
      lng: userLocation.lng,
    });
  });

  // document.getElementById("test").addEventListener("click", () => {
  //   console.log("clicked");
  //   socket.emit("user-join", {
  //     identifier: "HEHE",
  //     lat: userLocation.lat,
  //     lng: userLocation.lng,
  //   });
  // });

  socket.on("users-location", (users) => {
    console.log("users location", users);
    new BottomRightSectionComponent(new ListUserLocation(users));
  });

  // console.log("map page init", token);
}
mainMapPageScript();
