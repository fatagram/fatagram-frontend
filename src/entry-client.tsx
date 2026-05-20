import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import "./index.css";
import { hydrateRoot, createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const initialData = (window as any).__INITIAL_DATA__ || {};

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root not found in DOM");
}

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

if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  if (window.location.hostname !== "localhost") {
    navigator.serviceWorker.register("/sw.js");
  } else {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (let registration of registrations) {
        registration.unregister();
      }
    });
  }
}
