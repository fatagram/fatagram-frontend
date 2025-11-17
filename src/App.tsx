import "./i18n";
import ContextTree from "./context-tree";
import AppRoutes from "./routes";
import { GlobalDialog } from "./components/organisms";
import { NotificationListener } from "./features/notifications/components";
import { Provider } from "react-redux";
import store from "./store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create QueryClient ONCE with proper config
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (garbage collection time)
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ContextTree>
          <main>
            <AppRoutes />
            <GlobalDialog />
            <NotificationListener />
          </main>
        </ContextTree>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
