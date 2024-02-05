import { getLocation } from "/shared/location.js";
import { routes } from "/shared/routes.js";
import { storagedKeys } from "/shared/storagedKeys.js";

const registerForm = document.querySelector("#registerForm");

function fillLocationInputs({ lat, lng }) {
  if (lat && lng) {
    document.querySelector("#latInput").value = lat;
    document.querySelector("#lngInput").value = lng;
  }
}

function removeDisabledFromButtonSubmit() {
  document.getElementById("form-submit-button").removeAttribute("disabled");
}

async function registerUserLocation({ identifier, lat, lng }) {
  console.log({ lat, lng, identifier });
  if (!identifier || !lat || !lng) throw new Error("invalid parameters");

  const response = await fetch(routes.registerUserLocation, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      identifier: identifier.trim(),
      lat,
      lng,
    }),
  });
  console.log("response", response);

  const { data } = await response.json();
  console.log("data", data);
  if (data.redirect) {
    localStorage.setItem(storagedKeys.token, data.token);
    window.location.href = data.location;
  }
}

function registerListeners() {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("HEHE");
    const formData = new FormData(registerForm);

    const identifier = formData.get("identifier");

    if (identifier) {
      console.log("identifier", identifier);
      localStorage.setItem(
        storagedKeys.userIdentifier,
        JSON.stringify(identifier)
      );
      const userLocation = JSON.parse(
        localStorage.getItem(storagedKeys.userLocation)
      );
      console.log("userLocation", userLocation);
      // const userLocation = await getLocation();
      const payload = {
        identifier,
        ...userLocation,
      };
      await registerUserLocation(payload);
    }
  });
}

async function mainHomePageScript() {
  console.log("home script init");

  const userLocation = await getLocation();

  if (userLocation.lat && userLocation.lng) {
    removeDisabledFromButtonSubmit();
    registerListeners();
    fillLocationInputs(userLocation);
    localStorage.setItem(
      storagedKeys.userLocation,
      JSON.stringify(userLocation)
    );
  } else {
    //
  }

  console.log("userLocation", userLocation);
}
mainHomePageScript();
