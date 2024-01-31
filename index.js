import "dotenv/config.js";
import { httpServer } from "./httpServer.js";
import "./websocketServer.js";

httpServer.listen(3000).on("listening", () => console.log("rodando na 3000"));
