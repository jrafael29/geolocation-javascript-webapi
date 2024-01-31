import express from "express";

import { __dirname } from "./utils/index.js";

import { routes } from "./infra/routes/index.js";

export const app = express();

app.use(routes);
