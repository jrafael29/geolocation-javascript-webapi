import { redisConnection } from "../../database/redis.js";
import { RedisRepository } from "../../repository/RedisRepository.js";
import {
  errorResponse,
  successResponse,
} from "../../../utils/httpResponses.js";
import { RegisterUserLocationUseCase } from "../../../application/usecase/RegisterUserLocationUseCase.js";
import { RegisterServiceLocationUseCase } from "../../../application/usecase/RegisterServiceLocationUseCase.js";

export async function registerUserLocationController(req, res) {
  const requestBody = req.body;

  const identifierFromReq = requestBody.identifier;
  const latFromReq = requestBody.lat;
  const lngFromReq = requestBody.lng;
  try {
    const redisRepository = new RedisRepository(redisConnection);
    const registerUserLocationUseCase = new RegisterUserLocationUseCase(
      redisRepository
    );
    const payload = {
      lat: latFromReq,
      lng: lngFromReq,
      identifier: identifierFromReq,
      type: "users",
    };
    const token = await registerUserLocationUseCase.perform(payload);
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
}

export async function registerServiceLocationController(req, res) {
  const requestBody = req.body;

  const identifierFromReq = requestBody.identifier;
  const latFromReq = requestBody.lat;
  const lngFromReq = requestBody.lng;
  const typeFromReq = requestBody.type;
  console.log("REquest", requestBody);
  try {
    const payload = {
      lat: latFromReq,
      lng: lngFromReq,
      identifier: identifierFromReq,
      type: typeFromReq,
    };
    const redisRepository = new RedisRepository(redisConnection);

    const registerServiceLocationUseCase = new RegisterServiceLocationUseCase(
      redisRepository
    );
    await registerServiceLocationUseCase.perform(payload);

    const data = {
      message: "service created with success",
    };
    return successResponse(res, data, 201);
  } catch (error) {
    console.log("DEU RUIM::", error);
    return errorResponse(res, "internal server error");
  }
}
