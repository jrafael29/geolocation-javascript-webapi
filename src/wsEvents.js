import { redisConnection } from "./infra/database/redis.js";
import { getIdentifierFromToken } from "./utils/index.js";

const EVENTS_NAME = {
  updateUserLocation: "update-user-location",
};

export function onConnection(socket, io) {
  console.log("nova conexao", socket.id);
  socket.on(EVENTS_NAME.updateUserLocation, onUpdateUserLocation);
}

export async function onDisconnect(socket) {
  const token = socket.handshake.auth?.token;
  await Promise.all([
    redisConnection.del(token),
    redisConnection.zrem("users", getIdentifierFromToken(token)),
  ]);
  console.log("conexão desconectada:", token);
}

function onUpdateUserLocation(data) {
  console.log("bora atualizar:", data);
}
