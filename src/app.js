import express from "express";

import { redisConnection } from "./infra/database/redis.js";
import { __dirname } from "./utils/index.js";

import { routes } from "./infra/routes/index.js";

export const app = express();

//routes
app.use(routes);
