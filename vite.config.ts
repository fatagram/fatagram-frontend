import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react({
      // Exclude node_modules from babel transform
      exclude: /node_modules/,
      // Include only source files
      include: "**/*.{jsx,tsx}",
      // Enable automatic JSX runtime
      jsxRuntime: "automatic",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "~": path.resolve(__dirname, "./src/components"),
    },
  },
  server: {
    port: 3000,
    hmr: {
      overlay: true, // Show errors as overlay for better debugging
    },
    watch: {
      ignored: ["**/node_modules/**", "**/.git/**", "**/dist/**"],
    },
  },
  optimizeDeps: {
    // Pre-bundle these dependencies for faster dev server startup
    include: ["react", "react-dom", "react-router-dom", "@tanstack/react-query"],
  },
});
