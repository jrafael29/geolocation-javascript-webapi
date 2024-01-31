import { leafletMarkerFactory } from "/shared/components/on-map/LeafletMarkerFactory.js";
import { generateCoordinates } from "/shared/utils.js";
import { storagedKeys } from "/shared/storagedKeys.js";
import { routes } from "/shared/routes.js";

export class ListUserLocation {
  #elementId = `list-user-location`;
  #elementHTML;

  #usersLocation = [];

  constructor(users) {
    if (!users.length) throw new Error("invalid parameter");
    this.#usersLocation = users;
  }

  nodeElement() {
    let divNode = document.createElement("div");
    divNode.innerHTML = this.#html();
    return divNode;
  }

  #html() {
    let html = `
            <ol id="${this.#elementId}" class="list-group list-group-numbered">
                ${this.#usersLocation.map((userLocation) => {
                  const lat = (+userLocation.lat).toFixed(5);
                  const lng = (+userLocation.lng).toFixed(5);
                  const identifier = userLocation.identifier;
                  const distance = userLocation.distance;
                  const type = userLocation.type;

                  return `
                        <li class="list-group-item d-flex justify-content-between align-items-start m-1">
                            <div class="ms-2 me-auto">
                                <div class="fw-bold">${identifier}</div>
 
                                <small>${lat}, ${lng}</small>

                            </div>
                            <span class="badge bg-primary rounded-pill">${type}</span>
                        </li>
                    `;
                })}
            </ol>
      `;
    return html;
  }
}
