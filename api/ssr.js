import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function checkAuth(cookies) {
  try {
    // In Vercel, VITE_ prefix is not included for serverless functions
    const apiUrl = process.env.API_URL || process.env.VITE_API_URL;
    if (!apiUrl || !cookies) return null;

    // Call backend to verify auth
    const response = await fetch(`${apiUrl}/api/v1/userprofile/me`, {
      headers: {
        Cookie: cookies,
      },
      credentials: "include",
    });

    if (!response.ok) return null;

    const result = await response.json();
    if (result.success && result.data) {
      return {
        isAuthenticated: true,
        userData: {
          id: result.data.id,
          urlName: result.data.urlName,
          languageCode: result.data.languageCode,
          isOnBoarding: result.data.isOnBoarding,
        },
      };
    }
  } catch (error) {
    console.error("Auth check error:", error);
  }
  return null;
}

export default async function handler(req, res) {
  try {
    const url = req.url;
    
    // Check authentication from cookies
    const cookies = req.headers.cookie || "";
    const authContext = await checkAuth(cookies);

    // Read the template HTML
    const template = fs.readFileSync(path.resolve(__dirname, "../dist/client/index.html"), "utf-8");

    // Import the SSR entry point
    const { render } = await import("../dist/server/entry-server.js");

    // Render the app with auth context
    const appHtml = await render(url, authContext);

    // Inject auth context into HTML for hydration
    const authScript = authContext
      ? `<script>window.__INITIAL_DATA__ = ${JSON.stringify(authContext).replace(/</g, "\\u003c")};</script>`
      : "";

    // Inject the rendered HTML and auth data into the template
    const html = template
      .replace(`<!--app-html-->`, appHtml ?? "")
      .replace(`</head>`, `${authScript}</head>`);

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
