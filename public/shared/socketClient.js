import { io } from "https://cdn.socket.io/4.7.4/socket.io.esm.min.js";

export function socketPrivateConnection({ token }) {
  const wsHost = "wss://test.joserafael.dev.br";
  const socket = io(wsHostProd, {
    transports: ["websocket"],
    auth: {
      token: token,
    },
  });

  socket.on("connect", () => {
    console.log("socket conectado:");
  });

  socket.on("error", () => {
    console.log("erro ao conectar:");
  });

  return socket;
}
