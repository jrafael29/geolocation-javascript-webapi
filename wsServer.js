import { Server } from "socket.io";
import { httpServer } from "./httpServer.js";
import { onConnection, onDisconnect } from "./src/wsEvents.js";
import { redisConnection } from "./src/infra/database/redis.js";

export const io = new Server(httpServer);

// midleware
io.use(async function (socket, next) {
  const token = socket.handshake.auth?.token;
  const tokenExists = await redisConnection.get(token);
  if (tokenExists) next();
  socket.disconnect(true);
});

io.on("connection", (socket) => {
  onConnection(io, socket);
});

io.on("desconnectted", (data) => {
  console.log("desconnectted", data);
});
