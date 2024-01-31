import "dotenv/config";
import { httpServer } from "./httpServer.js";
import "./wsServer.js";

httpServer.listen(3000).on("listening", () => console.log("rodando na 3000"));
