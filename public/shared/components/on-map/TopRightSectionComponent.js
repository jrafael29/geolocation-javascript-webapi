export class TopRightSectionComponent {
  #elementId = `top-right-section`;
  #elementHTML = document.getElementById(this.#elementId);
  #childComponent;

  constructor(childComponentInstance) {
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
