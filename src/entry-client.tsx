import "./index.css";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// Read initial data from window object (set by server during SSR)
const initialData = (window as any).__INITIAL_DATA__ || {};

hydrateRoot(
  document.getElementById("root")!,
  <StrictMode>
    <BrowserRouter>
      <App authContext={initialData} />
    </BrowserRouter>
  </StrictMode>,
);
