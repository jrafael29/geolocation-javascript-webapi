import { UserLocation } from "../../domain/entity/UserLocation.js";
import { ServiceLocation } from "../../domain/entity/ServiceLocation.js";

export function locationFactory({ lat, lng, identifier, type }) {
  let location;
  if (type === "users") {
    location = new UserLocation({
      lat,
      lng,
      identifier,
      type,
    });
  } else {
    location = new ServiceLocation({
      lat,
      lng,
      identifier,
      type,
    });
  }

  return {
    lat: location.getLat(),
    lng: location.getLng(),
    identifier: location.getIdentifier(),
    type: location.getType(),
  };
}
