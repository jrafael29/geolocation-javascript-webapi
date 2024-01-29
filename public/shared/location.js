var watchId;
var geoLocation;

export function getLocation() {
  if (navigator.geolocation) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(function (position) {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        resolve(userLocation);
      });
    });
  } else {
    console.log("navegador não suporta geolocalização");
  }
}

export function watchLocation(
  successCb,
  errorCb,
  watchOptions = {
    enableHighAccuracy: false,
    timeout: 15000,
  }
) {
  if (navigator.geolocation) {
    geoLocation = navigator.geolocation;
    watchId = geoLocation.watchPosition(successCb, errorCb, watchOptions);
    console.log("watchId", watchId);
  } else {
    console.error("Geolocation is not supported by this browser.");
    return false;
  }
}

function showPosition(position) {
  console.log("position:", position.coords);
  return {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
  };
}
