import fs from "node:fs/promises";
import express from "express";
import cookieParser from "cookie-parser";
import { isProduction, port, base } from "./server/config.js";
import { handleSSR } from "./server/ssr-handler.js";

// Cached production assets
const templateHtml = isProduction ? await fs.readFile("./dist/client/index.html", "utf-8") : "";

// Create Express app
const app = express();

// Middlewares
app.use(cookieParser());

// Setup Vite or production middlewares
let vite;
if (!isProduction) {
  const { createServer } = await import("vite");
  vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    base,
  });
  app.use(vite.middlewares);
} else {
  const compression = (await import("compression")).default;
  const sirv = (await import("sirv")).default;
  app.use(compression());
  app.use(base, sirv("./dist/client", { extensions: [] }));
}

// SSR route handler
app.use("*all", (req, res) => handleSSR(req, res, vite, templateHtml));

// Start server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
