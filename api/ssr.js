import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async function handler(req, res) {
  try {
    const url = req.url;

    // Read the template HTML
    const template = fs.readFileSync(path.resolve(__dirname, "../dist/client/index.html"), "utf-8");

    // Import the SSR entry point
    const { render } = await import("../dist/server/entry-server.js");

    // Render the app - returns HTML string directly
    const appHtml = await render(url);

    // Inject the rendered HTML into the template
    const html = template.replace(`<!--app-html-->`, appHtml ?? "");

    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);
  } catch (error) {
    console.error("SSR Error:", error);
    console.error(error.stack);

    // Return template with empty root for client-side fallback
    const template = fs.readFileSync(path.resolve(__dirname, "../dist/client/index.html"), "utf-8");
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(template);
  }
}
