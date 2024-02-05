import { leafletMarkerFactory } from "/shared/components/on-map/LeafletMarkerFactory.js";
import { generateCoordinates } from "/shared/utils.js";
import { storagedKeys } from "/shared/storagedKeys.js";
import { routes } from "/shared/routes.js";

export class ListUserLocation {
  #elementId = `list-user-location`;
  #elementHTML;

  #usersLocation = [];

  constructor(users) {
    // if (!users.length) throw new Error("invalid parameter");
    this.#usersLocation = users;
  }

  init() {
    this.#elementHTML = document.getElementById(this.#elementId);
    this.#mount();
  }

  nodeElement() {
    let divNode = document.createElement("div");
    divNode.innerHTML = this.#html();
    return divNode;
  }

  #makeListItem({ lat, lng, identifier, type }) {
    return `
          <li id="${identifier}" class="list-group-item d-flex justify-content-between align-items-start m-1">
              <div class="ms-2 me-auto">
                  <div class="fw-bold">${identifier}</div>

                  <small>${lat}, ${lng}</small>

              </div>
              <span class="badge bg-primary rounded-pill">${type}</span>
          </li>
      `;
  }

  removeListItem({ identifier }) {
    document.getElementById(identifier).remove();
  }

  appendListItem({ lat, lng, identifier, type }) {
    if (!this.#elementHTML) {
      console.error(`Element with ID ${this.#elementId} not found.`);
      return;
    }

    let li = document.createElement("li");
    li.innerHTML = this.#makeListItem({ lat, lng, identifier, type });
    this.#elementHTML.append(li);
  }

  #mount() {
    if (!this.#usersLocation.length) return false;
    this.#usersLocation.map((userLocation) => {
      const lat = (+userLocation.lat).toFixed(5);
      const lng = (+userLocation.lng).toFixed(5);
      const identifier = userLocation.identifier;
      const distance = userLocation.distance;
      const type = userLocation.type;

      this.appendListItem({ lat, lng, identifier, type });
    });
  }

  #html() {
    let html = `
            <ol id="${this.#elementId}" class="list-group list-group-numbered">
            </ol>
      `;
    return html;
  }
}
