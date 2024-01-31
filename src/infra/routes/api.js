import { Router } from "express";

import { registerUserLocationController } from "../controller/api/index.js";
import { registerServiceLocationController } from "../controller/api/index.js";

export const routes = Router();
export const apiRoutes = Router();

apiRoutes.post("/register-user-location", registerUserLocationController);
apiRoutes.post("/register-service-location", registerServiceLocationController);
