import { leafletMarkerFactory } from "/shared/components/on-map/LeafletMarkerFactory.js";
import { generateCoordinates } from "/shared/utils.js";
import { storagedKeys } from "/shared/storagedKeys.js";
import { routes } from "/shared/routes.js";

export class FormAddLocation {
  #elementId = `form-add-location`;
  #elementHTML;

  #serviceTypes = [
    { id: "stores", name: "Loja" },
    { id: "public-places", name: "Local Publico" },
    { id: "others", name: "Outros" },
  ];

  nodeElement() {
    let divNode = document.createElement("div");
    divNode.innerHTML = this.#html();
    return divNode;
  }

  listeners() {
    this.#elementHTML = document.getElementById(this.#elementId);

    if (!this.#elementHTML)
      throw new Error(
        "you must be instance a object after call listeners registration"
      );
    this.#elementHTML.addEventListener("submit", this.#onSubmit.bind(this));

    document
      .getElementById("selectLocationOnMap")
      .addEventListener("click", this.#onSelectLocation);
  }

  #onSelectLocation() {
    console.log("EAEAE");

    const userLocation = JSON.parse(localStorage.getItem("userLocation"));
    const randomNearLocation = generateCoordinates(userLocation);
    leafletMarkerFactory.makeDraggable({
      lat: randomNearLocation.lat,
      lng: randomNearLocation.lng,
      cbDragend: (event) => {
        const { lat, lng } = event.target._latlng;
        localStorage.setItem(storagedKeys.otherLocationLat, lat);
        localStorage.setItem(storagedKeys.otherLocationLng, lng);
      },
    });
  }

  async #onSubmit(e) {
    e.preventDefault();
    const formData = this.#getData();

    if (!formData) throw new Error("empty fields");

    console.log("formData", formData);

    const response = await fetch(routes.registerServiceLocation, {
      method: "POST",
      body: JSON.stringify({
        ...formData,
        identifier: formData.name,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("response", response);
    const data = await response.json();
    console.log("data", data);
  }

  #getData() {
    const formData = new FormData(this.#elementHTML);
    const name = formData.get("name");
    const type = formData.get("type");
    const lat = localStorage.getItem(storagedKeys.otherLocationLat);
    const lng = localStorage.getItem(storagedKeys.otherLocationLng);

    if (!name || !type || !lat || !lng) {
      return false;
    }

    return {
      name,
      type,
      lat,
      lng,
    };
  }

  #html() {
    let html = `
        <div>
          <h6>Cadastre uma localização proximo a você</h4>
          <hr>
          <form id="form-add-location" action="">
              <div class="form-group mb-2">
                  <input required name="name" type="text" placeholder="Nome" class="form-control">
              </div>
              <div class="form-group mb-2">
                  <label for="" class="form-label">Tipo</label>
                  <select required name="type" class="form-select" aria-label="type select">
                      ${this.#serviceTypes.map((type) => {
                        return `<option value="${type.id}"> ${type.name} </option>`;
                      })}
                    </select>
              </div>
              <div class="form-group mb-2">
                  <button type="button" id="selectLocationOnMap" class="btn btn-sm btn-outline-info w-100">Selecionar localização no mapa</button>
                  <small class="fw-light">Para remover o marcador, clique duas vezes nele.</small>
                </div>
              <div class="form-group mb-2">
                  <label  for="" class="form-label"></label>
                  <button  type="submit" class="btn btn-sm btn-success w-100">Salvar</button>
              </div>
          </form>
        </div>
      `;
    return html;
  }
}
