import fs from "node:fs/promises";
import express from "express";
import { Transform } from "node:stream";

// Constants
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 3000;
const base = process.env.BASE || "/";
const ABORT_DELAY = 10000;

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile("./dist/client/index.html", "utf-8")
  : "";

// Create http server
const app = express();

// Add Vite or respective production middlewares
/** @type {import('vite').ViteDevServer | undefined} */
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

// Serve HTML
app.use("*all", async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, "");

    /** @type {string} */
    let template;
    /** @type {import('./src/entry-server.ts').render} */
    let render;
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile("./index.html", "utf-8");
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule("/src/entry-server.tsx")).render;
    } else {
      template = templateHtml;
      render = (await import("./dist/server/entry-server.js")).render;
    }

    // Render full HTML (no streaming) with inlined CSS
    try {
      const [htmlStart, htmlEnd] = template.split(`<!--app-html-->`);

      // Get compiled CSS to inline
      let css = "";
      if (isProduction) {
        try {
          css = await fs.readFile("./dist/client/assets/index.css", "utf-8");
        } catch (err) {
          console.error("Failed to read CSS in production:", err);
        }
      } else {
        // In dev mode, manually process CSS through PostCSS/Tailwind
        try {
          // Read raw CSS files
          const indexCss = await fs.readFile("./src/index.css", "utf-8");
          const fontsCss = await fs.readFile("./src/styles/fonts.css", "utf-8");
          const themesCss = await fs.readFile(
            "./src/styles/themes.css",
            "utf-8"
          );
          const animationCss = await fs.readFile(
            "./src/styles/animation.css",
            "utf-8"
          );

          // Combine all CSS - replace @import statements with actual content
          // Important: preserve order - fonts, themes (CSS vars), animation, then Tailwind
          let combinedCss = indexCss
            .replace(/@import ["']\.\/styles\/fonts\.css["'];?/g, fontsCss)
            .replace(/@import ["']\.\/styles\/themes\.css["'];?/g, themesCss)
            .replace(
              /@import ["']\.\/styles\/animation\.css["'];?/g,
              animationCss
            );

          // Process through PostCSS/Tailwind with config
          try {
            const postcss = (await import("postcss")).default;
            const tailwindcss = (await import("tailwindcss")).default;
            const autoprefixer = (await import("autoprefixer")).default;
            const path = (await import("path")).default;

            // Load Tailwind config
            const configPath = path.resolve(
              process.cwd(),
              "./tailwind.config.js"
            );

            const result = await postcss([
              tailwindcss({ config: configPath }),
              autoprefixer,
            ]).process(combinedCss, {
              from: "./src/index.css",
              to: undefined,
            });

            css = result.css;
          } catch (postcssErr) {
            // If PostCSS processing fails, use raw CSS as fallback
            console.warn(
              "PostCSS processing failed, using raw CSS:",
              postcssErr.message
            );
            css = combinedCss;
          }
        } catch (err) {
          console.error("Failed to compile CSS in dev:", err);
          console.error(err.stack);
        }
      }

      // Render app to HTML string
      const appHtml = render(url);

      // Theme initialization script (runs BEFORE React hydration to prevent flash)
      const themeScript = `<script>
(function() {
  try {
    var theme = localStorage.getItem('theme');
    var validThemes = ['light', 'dark'];
    if (!theme || validThemes.indexOf(theme) === -1) {
      var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme = prefersDark ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
</script>`;

      // Inline theme script + CSS into head
      const htmlWithStyles = htmlStart.replace(
        "</head>",
        `${themeScript}<style>${css}</style></head>`
      );

      // Send complete HTML
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
});

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
