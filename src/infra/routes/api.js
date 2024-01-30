import { Router } from "express";

export const routes = Router();
import { redisConnection } from "../database/redis.js";
import { RedisRepository } from "../repository/RedisRepository.js";

export const apiRoutes = Router();

import { ServiceLocation } from "../../domain/entity/ServiceLocation.js";

import { errorResponse, successResponse } from "../../utils/httpResponses.js";

apiRoutes.post("/register-user-location", async (req, res) => {
  const requestBody = req.body;

  const identifierFromReq = requestBody.identifier;
  const latFromReq = requestBody.lat;
  const lngFromReq = requestBody.lng;
  try {
    const userServiceLocation = new ServiceLocation({
      lat: latFromReq,
      lng: lngFromReq,
      identifier: identifierFromReq,
      type: "users",
    });

    const redisRepository = new RedisRepository(redisConnection);
    // await redisConnection.geoadd("users", [longitude, latitude, identifier]);
    await redisRepository.addMember({
      lat: userServiceLocation.getLat(),
      lng: userServiceLocation.getLng(),
      memberName: userServiceLocation.getIdentifier(),
      key: userServiceLocation.getType(),
    });

    const token = `${
      process.env.SECRET_KEY
    }.${userServiceLocation.getIdentifier()}.${new Date().valueOf()}`;

    await redisRepository.addToken(token);

    const data = {
      redirect: true,
      location: "/map",
      message: "registered with success",
      token: token,
    };
    return successResponse(res, data, 201);
  } catch (error) {
    console.log("ERROR:", error);
    return errorResponse(res, "internal server error");
  }
});

apiRoutes.post("/register-service-location", async (req, res) => {
  const requestBody = req.body;

  const identifierFromReq = requestBody.identifier;
  const latFromReq = requestBody.lat;
  const lngFromReq = requestBody.lng;
  const typeFromReq = requestBody.type;
  console.log("REquest", requestBody);
  try {
    const userServiceLocation = new ServiceLocation({
      lat: latFromReq,
      lng: lngFromReq,
      identifier: identifierFromReq,
      type: typeFromReq,
    });

    console.log("userServiceLocation", userServiceLocation);

    const redisRepository = new RedisRepository(redisConnection);
    // await redisConnection.geoadd("users", [longitude, latitude, identifier]);
    await redisRepository.addMember({
      lat: userServiceLocation.getLat(),
      lng: userServiceLocation.getLng(),
      memberName: userServiceLocation.getIdentifier(),
      key: userServiceLocation.getType(),
    });
    const data = {
      message: "service created with success",
    };
    return successResponse(res, data, 201);
  } catch (error) {
    console.log("DEU RUIM::", error);
    return errorResponse(res, "internal server error");
  }
});
