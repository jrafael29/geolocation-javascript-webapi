import express from "express";
import path from "node:path";
import cors from "cors";

export const middleware = express();

middleware.use(express.static(path.join(process.env.PWD, "/public")));
middleware.use(cors());
middleware.use(express.json());
