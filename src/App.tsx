import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { useMemo } from "react";
import ContextTree from "./context-tree";
import AppRoutes from "./routes";
import { GlobalDialog } from "./components/organisms/dialog";
import { NotificationListener } from "./features/notifications/components";

// Create QueryClient outside component to avoid recreation on every render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App: React.FC = () => {
  console.log("App rendered");
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
