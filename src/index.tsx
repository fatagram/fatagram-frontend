import React from "react";
import ReactDOM from "react-dom/client";
import "./i18n";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./api/setupInterceptor";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
    <App />
);

reportWebVitals();
