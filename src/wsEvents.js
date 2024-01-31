import { redisConnection } from "./infra/database/redis.js";
import { getIdentifierFromToken } from "./utils/index.js";
import { RedisRepository } from "./infra/repository/RedisRepository.js";
import { GetUserLocationUseCase } from "./application/usecase/GetUserLocationUseCase.js";
// usuario entrou: (foi cadastrado no redis) = emit user-join
// usuario saiu: (foi removido do redis) = emit user-left

// user-join    ->
//  será emitido para todos os usuarios onlines, atualizando o seus mapas com as novas localizações.

// user-left    ->
//  será emitido para todos os usuarios onlines, atualizando o seus mapas com as novas localizações.

const EVENTS_NAME = {
  updateUserLocation: "update-user-location",
  getUserLocation: "get-user-location",
  usersLocation: "users-location",
  userJoin: "user-join",
  userLeft: "user-left",
};

export function onConnection(io, socket) {
  console.log("nova conexao", socket.id);
  socket.on(EVENTS_NAME.updateUserLocation, onUpdateUserLocation);

  socket.on(EVENTS_NAME.userJoin, (data) => onUserJoin(io, socket, data));
  socket.on(EVENTS_NAME.userLeft, (data) => onUserLeft(io, socket, data));
}

export async function onDisconnect(io, socket) {
  const token = socket.handshake.auth?.token;

  const redisRepository = new RedisRepository(redisConnection);
  await redisRepository.removeToken(token);
  await redisRepository.removeMember({
    key: "users",
    identifier: getIdentifierFromToken(token),
  });

  // io.emit("user-left", { data: true });
  // socket.emit("user-left", { data: true });
  console.log("disconnect", token);
}

function onUpdateUserLocation(data) {
  console.log("bora atualizar:", data);
}

async function onUserJoin(io, socket, data) {
  console.log("new user joined", data);

  // get users
  const redisRepository = new RedisRepository(redisConnection);
  const usersLocation = await new GetUserLocationUseCase(
    redisRepository
  ).perform({
    lat: data.lat,
    lng: data.lng,
  });
  console.log("usersLocation", usersLocation);

  socket.emit(EVENTS_NAME.usersLocation, usersLocation);
}

async function onUserLeft(io, socket, data) {
  console.log("user left", data);

  const redisRepository = new RedisRepository(redisConnection);
  const usersLocation = await new GetUserLocationUseCase(
    redisRepository
  ).perform({
    lat: data.lat,
    lng: data.lng,
  });
  console.log("usersLocation", usersLocation);

  io.emit(EVENTS_NAME.usersLocation, usersLocation);

  // get users
}
