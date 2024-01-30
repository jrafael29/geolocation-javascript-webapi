export class ServiceLocation {
  #serviceTypes = ["users", "public-places", "stores", "others"];
  #lat;
  #lng;
  #identifier;
  #type;

  constructor({ lat, lng, identifier, type }) {
    this.#setLat(lat);
    this.#setLng(lng);
    this.#setIdentifier(identifier);
    this.#setType(type);
  }

  getLat() {
    return this.#lat;
  }
  getLng() {
    return this.#lng;
  }
  getIdentifier() {
    return this.#identifier;
  }
  getType() {
    return this.#type;
  }

  #setLat(lat) {
    if (!lat) throw new Error("invalid lat");
    this.#lat = +lat;
  }

  #setLng(lng) {
    if (!lng) throw new Error("invalid lng");
    this.#lng = +lng;
  }

  #setIdentifier(identifier) {
    if (!identifier) throw new Error("invalid identifier");
    this.#identifier = identifier.split(" ").join("-");
  }

  #setType(type) {
    if (!this.#typeIsValid(type)) throw new Error("invalid type");
    this.#type = type;
  }

  #typeIsValid(type) {
    return this.#serviceTypes.find((serviceType) => type === serviceType);
  }
}
