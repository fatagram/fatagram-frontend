import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { PassThrough } from "node:stream";
import App from "./App";

export function render(
  _url: string,
  context?: { isAuthenticated?: boolean; userData?: any },
): Promise<string> {
  const url = _url.startsWith("/") ? _url : "/" + _url;

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const passThrough = new PassThrough();

    passThrough.on("data", (chunk: Buffer) => chunks.push(chunk));
    passThrough.on("end", () => resolve(Buffer.concat(chunks).toString()));
    passThrough.on("error", reject);

    const { pipe } = renderToPipeableStream(
      <StaticRouter location={url}>
        <App authContext={context} />
      </StaticRouter>,
      {
        onShellReady() {
          pipe(passThrough);
        },
        onError(error) {
          console.error("SSR Error during render:", error);
          reject(error);
        },
      },
    );
  });
}
