import fs from "node:fs/promises";

/**
 * Compile CSS in development mode
 * Reads and processes CSS files through PostCSS/Tailwind
 */
export async function compileCssDev() {
  try {
    // Read global CSS files
    const indexCss = await fs.readFile("./src/index.css", "utf-8");
    const fontsCss = await fs.readFile("./src/styles/fonts.css", "utf-8");
    const themesCss = await fs.readFile("./src/styles/themes.css", "utf-8");
    const animationCss = await fs.readFile("./src/styles/animation.css", "utf-8");

    // Combine all CSS - global first, then modules
    let combinedCss = indexCss
      .replace(/@import ["']\.\/styles\/fonts\.css["'];?/g, fontsCss)
      .replace(/@import ["']\.\/styles\/themes\.css["'];?/g, themesCss)
      .replace(/@import ["']\.\/styles\/animation\.css["'];?/g, animationCss);

    // Process through PostCSS/Tailwind
    try {
      const postcss = (await import("postcss")).default;
      const tailwindcss = (await import("tailwindcss")).default;
      const autoprefixer = (await import("autoprefixer")).default;

      const result = await postcss([tailwindcss(), autoprefixer]).process(combinedCss, {
        from: "./src/index.css",
        to: undefined,
      });

      return result.css;
    } catch (postcssErr) {
      console.warn("PostCSS processing failed, using raw CSS:", postcssErr.message);
      return combinedCss;
    }
  } catch (err) {
    console.error("Failed to compile CSS in dev:", err);
    console.error(err.stack);
    return "";
  }
}

/**
 * Load CSS in production mode
 */
export async function loadCssProduction() {
  try {
    const path = (await import("path")).default;
    const { glob } = await import("glob");

    // Find CSS file with hash (e.g., index-abc123.css)
    const cssFiles = await glob("dist/client/assets/*.css");

    if (cssFiles.length === 0) {
      console.error("No CSS file found in dist/client/assets/");
      return "";
    }

    // Use the first CSS file found
    const cssFile = cssFiles[0];
    console.log(`Loading CSS from: ${cssFile}`);

    return await fs.readFile(cssFile, "utf-8");
  } catch (err) {
    console.error("Failed to read CSS in production:", err);
    return "";
  }
}

/**
 * Generate theme initialization script
 */
export function getThemeScript() {
  return `<script>
(function() {
  try {
    var theme = localStorage.getItem('theme');
    var validThemes = ['light', 'dark', 'universe', 'neon', 'dark-sea', 'dark-yellow', 'light-yellow-pink', 'pastel-yellow-pink', 'dark-red', 'emerald', 'aurora', 'dark-blue'];
    if (!theme || validThemes.indexOf(theme) === -1) {
      var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme = prefersDark ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', theme);

    var themeToColor = {
      'light': '#ffffff',
      'dark': '#000000',
      'universe': '#0f172a',
      'neon': '#0a0a0a',
      'dark-sea': '#022c22',
      'dark-yellow': '#1c1917',
      'light-yellow-pink': '#ffffff',
      'pastel-yellow-pink': '#fff7d9',
      'dark-red': '#0c0a0a',
      'emerald': '#022c22',
      'aurora': '#031220',
      'dark-blue': '#071633'
    };
    var color = themeToColor[theme] || '#ffffff';
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', color);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
</script>`;
}
