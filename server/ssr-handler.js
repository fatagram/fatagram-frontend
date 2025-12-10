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

    const { isAuthenticated } = await auth(req, res);
    const redirected = handleRouteProtection(url, { isAuthenticated }, res);
    if (redirected) {
      return;
    }

    let userData;
    if (isAuthenticated) {
      userData = await user(req);
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
      const appHtml = render(url, { isAuthenticated, userData });

      // Serialize initial data for client hydration
      const initialData = {
        isAuthenticated,
        userData,
      };
      console.log("[SSR] Initial Data:", initialData);
      const initialDataScript = `<script>window.__INITIAL_DATA__ = ${JSON.stringify(
        initialData,
      )};</script>`;

      const themeScript = getThemeScript();
      const htmlWithStyles = htmlStart.replace(
        "</head>",
        `${themeScript}${initialDataScript}<style>${css}</style></head>`,
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
