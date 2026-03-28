import "./index.css";
import { hydrateRoot, createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const initialData = (window as any).__INITIAL_DATA__ || {};

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root not found in DOM");
}

// Check if server rendered actual HTML content (not just whitespace/comments)
const hasSSRContent =
  rootElement.childNodes.length > 0 &&
  rootElement.innerHTML.replace(/<!--.*?-->/g, "").trim().length > 0;

const app = (
  <BrowserRouter>
    <App authContext={initialData} />
  </BrowserRouter>
);

if (hasSSRContent) {
  try {
    hydrateRoot(rootElement, app, {
      onRecoverableError: (error) => {
        console.warn("Hydration mismatch:", error);
      },
    });
  } catch (e) {
    // Hydration failed — fall back to full client-side render
    console.error("Hydration failed, falling back to client render:", e);
    rootElement.innerHTML = "";
    createRoot(rootElement).render(app);
  }
} else {
  createRoot(rootElement).render(app);
}

// Register service worker for PWA (safe, non-blocking)
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const swUrl = "/sw.js";
    navigator.serviceWorker
      .register(swUrl, { scope: "/" })
      .then((reg) => {
        console.log("Service worker registered successfully.", reg);
        // Check for updates periodically
        setInterval(() => {
          reg.update();
        }, 60000); // Check every 60 seconds
      })
      .catch((err) => {
        console.warn("Service worker registration failed:", err);
      });
  });
}
