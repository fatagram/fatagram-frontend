import "./i18n";
import i18next from "i18next";
import ContextTree from "./context-tree";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Main from "./main";
import { useRef } from "react";

function App({ authContext }: { authContext?: { isAuthenticated?: boolean; userData?: any } }) {
  const queryClientRef = useRef<QueryClient | null>(null);
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: 1,
          staleTime: 5 * 60 * 1000,
          gcTime: 10 * 60 * 1000,
        },
      },
    });
  }

  if (authContext?.userData.languageCode) {
    i18next.changeLanguage(authContext.userData.languageCode);
  }

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <ContextTree authContext={authContext}>
        <Main />
      </ContextTree>
    </QueryClientProvider>
  );
}

export default App;
