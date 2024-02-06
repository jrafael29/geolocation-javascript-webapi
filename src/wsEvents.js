import { redisConnection } from "./infra/database/redis.js";
import { getIdentifierFromToken } from "./utils/index.js";
import { RedisRepository } from "./infra/repository/RedisRepository.js";
import { GetUserLocationUseCase } from "./application/usecase/GetUserLocationUseCase.js";

import crypto from "node:crypto";

const EVENTS_NAME = {
  updateUserLocation: "update-user-location",
  usersLocation: "users-location",

  // cada usuario irá emitir pro servidor:
  userJoin: "user-join", // ao entrar
  userLeft: "user-left", // ao sair
  userMove: "user-move", // ao movimentar
  userSendMessage: "user-send-message", // ao enviar uma mensagem

  // o servidor irá emitir para todos os usuarios:313
  userJoined: "user-joined", // quando um usuario entrar
  userLefted: "user-lefted", // quando um usuario sair
  userMoved: "user-moved", // quando um usuario se movimentar
  newMessage: "new-message", // quando um usuario enviar uma mensagem
};

{
  function onUserJoin(data) {
    const { lat, lng, identifier } = data;
    if (!lat || !lng || !identifier) {
      // on error, event 'error' catch it:
      throw new Error("invalid parameters");
    }
    // receber informações do usuario
    emit("user-joined", data);
  }
  function onUserLeft() {
    // receber informações do usuario
    emit("user-lefted");
  }
  function onUserMove() {
    // receber informações do usuario (nova localização)
    emit("user-moved");
  }
}

// quando um usuario se conectar
export function onConnection(io, socket) {
  console.log("nova conexao", socket.id);
  socket.on(EVENTS_NAME.updateUserLocation, onUpdateUserLocation);

  // listener: quando um usuario entrar
  socket.on(EVENTS_NAME.userJoin, (data) => onUserJoin(io, socket, data));
  socket.on(EVENTS_NAME.userMove, (data) => {
    socket.broadcast.emit(EVENTS_NAME.userMoved, data);
  });

  // listener: quando um usuario sair
  socket.on(EVENTS_NAME.userLeft, (data) => onUserLeft(io, socket, data));
  socket.on(EVENTS_NAME.usersLocation, (data) =>
    onUsersLocation(io, socket, data)
  );

  // listener: quando um usuario enviar uma mensagem
  socket.on(EVENTS_NAME.userSendMessage, (data) =>
    onSendMessage(io, socket, data)
  );

  socket.on("disconnect", () => onDisconnect(io, socket));
}

function onSendMessage(io, socket, data) {
  // usuario enviou uma nova mensagem
  console.log("nova message", data);

  const { sender, message } = data;
  const newMessage = {
    id: crypto.randomUUID(),
    sender,
    message,
    date: new Date(),
  };
  console.log("usuario enviou uma mensagem", newMessage);

  socket.broadcast.emit(EVENTS_NAME.newMessage, newMessage);
}

export async function onDisconnect(io, socket) {
  const user = socket.user;
  // emit to all connections:
  io.emit("user-lefted", user);
  const token = socket.handshake.auth?.token;
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

async function onUserJoin(io, socket, data) {
  console.log("new user joined", data);
  socket.user = data;
  // get users
  const redisRepository = new RedisRepository(redisConnection);
  const usersLocation = await new GetUserLocationUseCase(
    redisRepository
  ).perform({
    lat: data.lat,
    lng: data.lng,
  });
  socket.broadcast.emit(EVENTS_NAME.userJoined, { ...data, type: "user" });
  // console.log("usersLocation", usersLocation);
  socket.emit(EVENTS_NAME.usersLocation, usersLocation);
}

async function onUserLeft(io, socket, data) {
  console.log("user left", socket.user);

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

async function onUsersLocation(io, socket, data) {
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
