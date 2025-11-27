import "./i18n";
import ContextTree from "./context-tree";
import { Provider } from "react-redux";
import store from "./store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Main from "./main";

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

function App({ authContext }: { authContext?: { isAuthenticated?: boolean; userData?: any } }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ContextTree authContext={authContext}>
          <Main />
        </ContextTree>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
