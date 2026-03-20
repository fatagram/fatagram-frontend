// Don't import CSS in SSR - it's inlined by server.js
// import "./index.css";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";

// Non-streaming render: returns full HTML string
export function render(_url: string, context?: { isAuthenticated?: boolean; userData?: any }) {
  const url = _url.startsWith("/") ? _url : "/" + _url;

  try {
    const html = renderToString(
      <StaticRouter location={url}>
        <App authContext={context} />
      </StaticRouter>,
    );

    return html;
  } catch (error) {
    console.error("SSR Error during render:", error);
    if (error instanceof Error) {
      console.error(error.stack);
    }
    // Return empty string — entry-client.tsx will detect this and use createRoot
    // instead of hydrateRoot, doing a full client-side render
    return "";
  }
}
