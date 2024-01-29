import { webRoutes } from "./web.js";
import { apiRoutes } from "./api.js";
import { middleware } from "../middleware/index.js";
import { Router } from "express";

export const routes = Router();

routes.use(middleware);
routes.use(webRoutes);
routes.use(apiRoutes);
