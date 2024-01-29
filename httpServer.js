import http from "http";
import { app } from "./src/app.js";

export const httpServer = http.createServer(app);