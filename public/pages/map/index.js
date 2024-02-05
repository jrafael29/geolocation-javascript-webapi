import { leafletMap } from "/shared/components/map/LeafletMap.js";
import { FormAddLocation } from "/shared/components/on-map/children/FormAddLocation.js";
import { TopRightSectionComponent } from "/shared/components/on-map/TopRightSectionComponent.js";
import { storagedKeys } from "/shared/storagedKeys.js";
import { socketPrivateConnection } from "/shared/socketClient.js";
import { BottomRightSectionComponent } from "/shared/components/on-map/BottomRightSectionComponent.js";
import { ListUserLocation } from "../../shared/components/on-map/children/ListUserLocation.js";

import { watchLocation } from "/shared/location.js";

const listUsersComponent = new ListUserLocation([]);

function mapInit({ lat, lng }) {
  leafletMap.init({ lat, lng, viewZoom: 15 });
  // leafletMap.addSelfMarker({ lat, lng });
}

function clearStorage() {
  Object.values(storagedKeys).forEach((key) => {
    localStorage.removeItem(key);
  });
}

{
  function onUserJoined() {
    // receber informações do novo usuario
    // like: lat, lng, identifier, type
  }
  function onUserLefted() {
    // receber informações do novo usuario
    // like: lat, lng, identifier, type
  }
  function onUserMoved() {
    // receber informações do novo usuario
    // like: new-lat, new-lng, identifier, type
  }
}

function getStoragedUserData() {
  const [identifier, userLocation, token] = [
    JSON.parse(localStorage.getItem(storagedKeys.userIdentifier)),
    JSON.parse(localStorage.getItem(storagedKeys.userLocation)),
    localStorage.getItem(storagedKeys.token),
  ];

  const outputData = {
    identifier,
    lat: userLocation.lat,
    lng: userLocation.lng,
    token,
  };
  console.log("outputData", outputData);
  if (
    !outputData.identifier ||
    !outputData.lat ||
    !outputData.lng ||
    !outputData.token
  ) {
    throw new Error("erro ao obter dados armazenados do usuario", outputData);
  }
  return outputData;
}

function userJoinedInteractor({ lat, lng, identifier, self = false }) {
  const fLat = parseFloat(lat);
  const fLng = parseFloat(lng);

  if (self) {
    // adiciona marcador proprio ao mapa
    leafletMap.addSelfMarker({ lat: fLat, lng: fLng, identifier });
  } else {
    //adicionar marcador ao mapa
    leafletMap.addUserMarker({ lat: fLat, lng: fLng, text: identifier });
  }

  // adicionar item à lista de usuarios online
  listUsersComponent.appendListItem({
    lat: fLat,
    lng: fLng,
    identifier,
    type: "users",
  });
}

function userLeftedInteractor({ identifier }) {
  // remove marcador do mapa
  leafletMap.removeUserMarker({
    identifier,
  });
  // remove item da lista de usuarios online.
  listUsersComponent.removeListItem({ identifier });
}

function isLocationEqual(location1, location2) {
  return location1.lat === location2.lat && location1.lng === location2.lng;
}

async function mainMapPageScript() {
  try {
    const { lat, lng, identifier, token } = getStoragedUserData();
    if (!lat || !lng || !identifier) {
      window.location.href = "/";
    }
    clearStorage();

    // inicializa o mapa
    mapInit({ lat, lng });

    // inicializa o componente superior-direito
    // new TopRightSectionComponent(new FormAddLocation());

    new BottomRightSectionComponent(listUsersComponent);

    // start websocket connection
    const socket = socketPrivateConnection({
      token: token,
      lat: lat,
      lng: lng,
      identifier: identifier,
    });
    userJoinedInteractor({ lat, lng, identifier, self: true });

    watchLocation(
      (position) => {
        const { latitude, longitude } = position.coords;

        const lastWatchedLocationStoraged = localStorage.getItem(
          storagedKeys.lastWatchedLocation
        );
        const actualWatchedLocation = { lat: latitude, lng: longitude };

        if (lastWatchedLocationStoraged) {
          // If saved location exists
          const lastWatchedLocation = JSON.parse(lastWatchedLocationStoraged);
          const locationsAreEqual = isLocationEqual(
            actualWatchedLocation,
            lastWatchedLocation
          );
          if (!locationsAreEqual) {
            socket.emit("user-move", {
              ...actualWatchedLocation,
              identifier,
            });
          }
        } else {
          // If no saved location exists
          socket.emit("user-move", {
            ...actualWatchedLocation,
            identifier,
          });
        }
        localStorage.setItem(
          storagedKeys.lastWatchedLocation,
          JSON.stringify(actualWatchedLocation)
        );
        // leafletMap.updateSelfMarker({ lat: latitude, lng: longitude });

        // only emit if current location is different than last location
        // i can use localStorage for storage last location

        console.log("new position:", position);
      },
      (error) => {
        console.log("deu ruim no watchlocation:", error);
      }
    );

    // "avisa" que o usuario entrou.
    socket.emit("user-join", {
      identifier: identifier,
      lat: lat,
      lng: lng,
    });
    // "avisa" que o usuario saiu

    // "avisa" que o usuario saiu
    socket.on("user-left", (data) => {});

    // document.getElementById("test").addEventListener("click", () => {
    //   console.log("clicked");
    //   socket.emit("user-join", {
    //     identifier: "HEHE",
    //     lat: userLocation.lat,
    //     lng: userLocation.lng,
    //   });
    // });

    socket.on("user-joined", (userData) => {
      console.log("USER JOINED:", userData);
      const { lat, lng, identifier, type = "users" } = userData;
      if (lat && lng && identifier) {
        userJoinedInteractor({ lat, lng, identifier });
        // listUsersComponent.appendListItem({ lat, lng, identifier, type });
        // leafletMap.addUserMarker({
        //   lat: lat,
        //   lng: lng,
        //   text: identifier,
        // });
      }
    });
    socket.on("user-lefted", (userData) => {
      console.log("USER LEFTED:", userData);
      const { lat, lng, identifier } = userData;
      userLeftedInteractor({ identifier });
      // listUsersComponent.removeListItem({ identifier });
      // leafletMap.removeUserMarker({
      //   identifier,
      // });
    });
    socket.on("user-moved", (userData) => {
      console.log("USER MOVED:", userData);
      const { lat, lng, identifier } = userData;
      leafletMap.updateUserMarker({
        lat,
        lng,
        identifier,
      });
    });

    socket.on("users-location", (users) => {
      console.log("users location", users);

      const usersWithoutSelf = users.filter((user) => {
        return user.identifier != identifier.split(" ").join("-");
      });

      usersWithoutSelf.map((user) => {
        if (user) {
          const { lat, lng, identifier, type = "users" } = user;
          if (lat && lng && identifier) {
            userJoinedInteractor({ lat, lng, identifier });
          }
        }
      });

      console.log("usersWithoutSelf", usersWithoutSelf);
    });

    socket.on("disconnect", () => {
      socket.emit("user-left", { lat, lng, identifier });
    });
    // console.log("map page init", token);
  } catch (error) {
    console.error("error", error);
    window.location.href = "/";
  }
}
mainMapPageScript();
