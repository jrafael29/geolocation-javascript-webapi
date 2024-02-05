export class BottomRightSectionComponent {
  #elementId = `bottom-right-section`;
  #elementHTML = document.getElementById(this.#elementId);
  #childComponent;

  constructor(childComponentInstance) {
    this.#elementHTML.innerHTML = "";

    this.#childComponent = childComponentInstance;
    this.#mount(this.#childComponent.nodeElement());
    this.#childComponent.init();
  }

  addContent(node) {
    this.#elementHTML.appendChild(node);
  }

  #mount(element) {
    if (element) this.addContent(element);
  }
}
