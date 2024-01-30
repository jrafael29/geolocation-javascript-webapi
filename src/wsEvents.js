import { redisConnection } from "./infra/database/redis.js";
import { getIdentifierFromToken } from "./utils/index.js";
import { RedisRepository } from "./infra/repository/RedisRepository.js";

const EVENTS_NAME = {
  updateUserLocation: "update-user-location",
};

export function onConnection(socket, io) {
  console.log("nova conexao", socket.id);
  socket.on(EVENTS_NAME.updateUserLocation, onUpdateUserLocation);
}

export async function onDisconnect(socket) {
  const token = socket.handshake.auth?.token;
  console.log("disconnect", token);
  const redisRepository = new RedisRepository(redisConnection);
  await redisRepository.removeToken(token);
  await redisRepository.removeMember({
    key: "users",
    identifier: getIdentifierFromToken(token),
  });
}

function onUpdateUserLocation(data) {
  console.log("bora atualizar:", data);
}
