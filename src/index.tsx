import React from "react";
import ReactDOM from "react-dom/client";
import "./i18n";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./api/setupInterceptor";
import whyDidYouRender from "@welldone-software/why-did-you-render";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./store";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

whyDidYouRender(React, {
    trackAllPureComponents: false,
  });

const queryClient = new QueryClient();

root.render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <App />
    </Provider>
  </QueryClientProvider>
);

reportWebVitals();
