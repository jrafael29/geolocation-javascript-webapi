export class ChatContainer {
  #elementId = `messages-container`;
  #elementHTML;
  #socket;
  #userIdentifier;

  constructor({ socket, userIdentifier }) {
    this.#socket = socket;
    this.#userIdentifier = userIdentifier;
  }

  nodeElement() {
    let divNode = document.createElement("div");
    divNode.innerHTML = this.#html();
    return divNode;
  }

  init() {
    this.#elementHTML = document.getElementById(this.#elementId);
    this.#listeners();
  }

  #listeners() {
    document
      .getElementById("sendMessageBtn")
      .addEventListener("click", this.#sendMessageHandle.bind(this));
  }

  scrollChatToBottom() {
    this.#elementHTML.scrollTop = this.#elementHTML.scrollTop;
  }

  #sendMessageHandle(e) {
    const messageInput = document.getElementById("messageInput");
    const messageValue = messageInput.value.trim();
    if (messageValue.length) {
      this.#socket.emit("user-send-message", {
        message: messageValue,
        sender: this.#userIdentifier,
      });

      this.newMessage({ self: true, from: "você", message: messageValue });
    }

    messageInput.value = "";
    this.scrollChatToBottom();
  }

  newMessage({ from, message, self = false }) {
    const fakeId = `${from}-${(Math.random() + 1).toString(36).substring(7)}`;
    const messageDiv = this.#messageElement({
      id: fakeId,
      from,
      message,
      self,
    });

    this.#elementHTML.appendChild(messageDiv);
  }

  #messageElement({ id, from, message, self = false }) {
    let messageHtml;

    // balão diferentes
    if (self) {
      messageHtml = `
        <div id="${id}" class="d-flex flex-column justify-content-start mb-4">
            <div class="rounded p-3 ms-3" style="border-radius: 15px; background-color: rgba(57, 192, 237,.2);">
                <span><b>${from}:</b></span>
                <p class="small mb-0">${message}</p>
            </div>
        </div>
    `;
    } else {
      messageHtml = `<div class="px-1 d-flex flex-column justify-content-start mb-4">
        <div id="${id}" class="p-3 me-3 border" style="border-radius: 15px; background-color: #fbfbfb;">
            <span><b>${from}:</b></span>
            <p class="small mb-0">${message}</p>
        </div>
    </div>`;
    }
    let divMessage = document.createElement("div");
    divMessage.innerHTML = messageHtml;
    return divMessage;
  }

  #html() {
    let html = `
      <div class="card" id="chat1" style="border-radius: 15px;">
        <div class="card-header d-flex justify-content-between align-items-center p-3 bg-info text-white border-bottom-0" style="border-top-left-radius: 15px; border-top-right-radius: 15px;">
          <i class="fas fa-angle-left"></i>
          <p class="mb-0 fw-bold">Chat</p>
          <i class="fas fa-times"></i>
        </div>
        <div class="card-body">
          <div style="max-height: 220px; overflow-y: auto; font-size: 14px;" id="${
            this.#elementId
          }">
          
          </div>
          <div class="form-outline mt-3 d-flex">
            <div class="col-8">
              <input class=" form-control" name="message" id="messageInput" type="text" placeholder="Digitar mensagem"/>
            </div>
            <div> 
              <button id="sendMessageBtn" class="btn btn-info">Enviar</button>
            </div>
          </div>
        
        </div>
      </div>
      `;
    return html;
  }
}
