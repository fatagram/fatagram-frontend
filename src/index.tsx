import React from "react";
import ReactDOM from "react-dom/client";
import "./i18n";
import "./index.css";
import App from "./app";
import reportWebVitals from "./reportWebVitals";
import "@fortawesome/fontawesome-free/css/all.min.css";
import whyDidYouRender from "@welldone-software/why-did-you-render";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import store from "./store/store";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

// // Only enable Why Did You Render when explicitly needed for debugging
// if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_WDYR === 'true') {
//   whyDidYouRender(React, {
//     trackAllPureComponents: false,
//     collapseGroups: true,
//     logOnDifferentValues: false,
//   });
// }

// Create QueryClient with proper config
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

root.render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <App />
    </Provider>
  </QueryClientProvider>,
);

reportWebVitals();
