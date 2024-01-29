import { Router } from "express";
import { renderPage } from "../../utils/index.js";

export const webRoutes = Router();

webRoutes.get("/", async (req, res) => {
  // const result = await redisConnection.get('name')
  // console.log("result is:", result);
  // return res.json({message: "EAE"}).end();
  return res.sendFile(renderPage("home", "home.html"));
});

webRoutes.get("/map", (req, res) => {
  return res.sendFile(renderPage("map", "map.html"));
});
