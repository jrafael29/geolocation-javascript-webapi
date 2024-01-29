import path from "node:path";
import { fileURLToPath } from "node:url";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
export const renderPage = (...filename) =>
  path.join(process.env.PWD, "public", "pages", ...filename);
export const getIdentifierFromToken = (token) => token.split(".")[1];
