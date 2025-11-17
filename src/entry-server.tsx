import { StrictMode } from "react";
import "./index.css";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";

// Non-streaming render: returns full HTML string
export function render(_url: string) {
  const url = _url.startsWith("/") ? _url : "/" + _url;
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>
  );
}
