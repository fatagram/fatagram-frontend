import { StrictMode } from "react";
// Import CSS to let Vite handle CSS modules hashing
import "./index.css";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";

// Non-streaming render: returns full HTML string
export function render(_url: string, context?: { isAuthenticated?: boolean; userData?: any }) {
  const url = _url.startsWith("/") ? _url : "/" + _url;

  try {
    const html = renderToString(
      <StrictMode>
        <StaticRouter location={url}>
          <App authContext={context} />
        </StaticRouter>
      </StrictMode>,
    );

    return html;
  } catch (error) {
    console.error("SSR Error during render:", error);
    if (error instanceof Error) {
      console.error(error.stack);
    }
    return ""; // Return empty on error
  }
}
