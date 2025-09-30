import React from "react";
import "./App.css";
import "./styles/global.css";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import GlobalDialog from "./components/organisms/dialog/global-dialog";
import NotificationListener from "./features/notifications/components/notification-listener";
import ContextTree from "./context-tree";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const App: React.FC = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ContextTree>
          <AppRoutes />
          <GlobalDialog />
          <NotificationListener />
        </ContextTree>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
