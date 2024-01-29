import { Router } from "express";

export const routes = Router();
import { redisConnection } from "../database/redis.js";

export const apiRoutes = Router();

apiRoutes.post("/register-location", async (req, res) => {
  const requestBody = req.body;

  const identifier = requestBody.identifier.split(" ").join("-");
  const latitude = requestBody.lat;
  const longitude = requestBody.lng;
  try {
    if (identifier && latitude && longitude) {
      await redisConnection.geoadd("users", [longitude, latitude, identifier]);
      const token = `${
        process.env.SECRET_KEY
      }.${identifier}.${new Date().valueOf()}`;

      await redisConnection.setex(token, 300, JSON.stringify(true));

      return res
        .json({
          data: {
            redirect: true,
            location: "/map",
            message: "registered with success",
            token: token,
          },
        })
        .end();
    }
    return res
      .json({
        data: {
          error: false,
          message: "parametros inválidos",
        },
      })
      .end();
  } catch (error) {
    return res
      .json({
        data: {
          error: true,
          message: "internal server error",
        },
      })
      .end();
  }
});
