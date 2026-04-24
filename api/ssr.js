import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { checkAuth } from "../server/api/auth.js";
import { user } from "../server/api/user.js";
import { getThemeScript } from "../server/utils/css.js";
import { protectedRoutes, authRoutes } from "../server/config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function matchesRoute(url, route) {
  return url === route || url.startsWith(route + "/") || url.startsWith(route + "?");
}

export default async function handler(req, res) {
  try {
    const url = req.url;
    const cleanUrl = (url.startsWith("/") ? url.substring(1) : url).replace(/\?.*$/, "");

    const { isAuthenticated, refreshedCookie, setCookieHeaders } = await checkAuth(
      req.headers.cookie || "",
    );

    if (setCookieHeaders) {
      setCookieHeaders.forEach((c) => {
        res.setHeader("Set-Cookie", c);
      });
    }

    const isProtectedRoute = protectedRoutes.some((route) => matchesRoute(cleanUrl, route));
    const isAuthRoute = authRoutes.some((route) => matchesRoute(cleanUrl, route));

    if (isProtectedRoute && !isAuthenticated) {
      res.writeHead(302, { Location: `/login?returnTo=${url}` });
      res.end();
      return;
    }
    if (isAuthRoute && isAuthenticated) {
      res.writeHead(302, { Location: "/" });
      res.end();
      return;
    }

    let userData;
    if (isAuthenticated) {
      userData = await user(req, refreshedCookie);
    }

    const template = fs.readFileSync(path.resolve(__dirname, "../dist/client/index.html"), "utf-8");
    const { render } = await import("../dist/server/entry-server.js");

    const appHtml = await render(url, { isAuthenticated, userData });

    const initialData = { isAuthenticated, userData };
    const safeJson = JSON.stringify(initialData)
      .replace(/</g, "\\u003c")
      .replace(/>/g, "\\u003e")
      .replace(/&/g, "\\u0026")
      .replace(/'/g, "\\u0027");
    const initialDataScript = `<script>window.__INITIAL_DATA__ = ${safeJson};</script>`;

    const themeScript = getThemeScript();

    const [htmlStart, htmlEnd] = template.split(`<!--app-html-->`);
    const htmlWithHead = htmlStart.replace("</head>", `${themeScript}${initialDataScript}</head>`);

    const html = htmlWithHead + (appHtml ?? "") + htmlEnd;

    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);
  } catch (error) {
    console.error("SSR Error:", error);
    console.error(error.stack);

    const template = fs.readFileSync(path.resolve(__dirname, "../dist/client/index.html"), "utf-8");
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(template);
  }
}
