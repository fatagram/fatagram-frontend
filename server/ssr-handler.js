import fs from "node:fs/promises";
import { isProduction, base } from "./config.js";
import { auth } from "./api/auth.js";
import { user } from "./api/user.js";
import { compileCssDev, loadCssProduction, getThemeScript } from "./utils/css.js";
import { handleRouteProtection } from "./utils/route-protection.js";

/**
 * SSR request handler
 */
export async function handleSSR(req, res, vite, templateHtml) {
  try {
    const url = req.originalUrl.replace(base, "");

    // Skip SSR for static assets that fell through Vite middleware (prevents JSON parse errors etc)
    if (url.match(/\.(json|png|jpg|jpeg|gif|css|js|ico|svg|map|woff2?|ttf)$/i)) {
      return res.status(404).end();
    }

    const { isAuthenticated, refreshedCookie } = await auth(req, res);
    const redirected = handleRouteProtection(url, { isAuthenticated }, res);
    if (redirected) {
      return;
    }

    let userData;
    if (isAuthenticated) {
      // Use refreshed cookies if token was refreshed, otherwise use original
      userData = await user(req, refreshedCookie);
    }

    let template;
    let render;

    if (!isProduction) {
      template = await fs.readFile("./index.html", "utf-8");
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule("/src/entry-server.tsx")).render;
    } else {
      template = templateHtml;
      render = (await import("../dist/server/entry-server.js")).render;
    }

    try {
      const [htmlStart, htmlEnd] = template.split(`<!--app-html-->`);

      // Compile/load CSS
      const css = isProduction ? await loadCssProduction() : await compileCssDev();

      // Render app to HTML string
      const appHtml = await render(url, { isAuthenticated, userData });

      // Serialize initial data for client hydration
      const initialData = {
        isAuthenticated,
        userData,
      };
      console.log("[SSR] Initial Data:", initialData);
      // Escape JSON for safe embedding inside <script> tag
      // Prevents </script>, <!--, and other sequences from breaking HTML parsing
      const safeJson = JSON.stringify(initialData)
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e")
        .replace(/&/g, "\\u0026")
        .replace(/'/g, "\\u0027");
      const initialDataScript = `<script>window.__INITIAL_DATA__ = ${safeJson};</script>`;

      const themeScript = getThemeScript();
      const htmlWithStyles = htmlStart.replace(
        "</head>",
        `<style>${css}</style>${themeScript}${initialDataScript}</head>`,
      );

      res.status(200);
      res.set({ "Content-Type": "text/html" });
      res.send(htmlWithStyles + appHtml + htmlEnd);
    } catch (error) {
      console.error("SSR Error:", error);
      res.status(500);
      res.set({ "Content-Type": "text/html" });
      res.send("<h1>Something went wrong</h1>");
    }
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
}
