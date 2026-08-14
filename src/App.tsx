import "./i18n";
import i18next from "i18next";
import ContextTree from "./context-tree";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Main from "./main";
import { useEffect, useRef } from "react";
import { ChatQueryNetworkSync } from "./features/chat/components/chat-query-network-sync";

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

  if (authContext?.userData?.languageCode) {
    i18next.changeLanguage(authContext.userData.languageCode);
  } else {
    if (typeof window !== "undefined" && window.navigator) {
      const browserLang =
        window.navigator.language || (window.navigator as any).userLanguage || "en";
      const shortLang = browserLang.split("-")[0];
      const targetLang = shortLang === "vi" || shortLang === "en" ? shortLang : "en";
      if (i18next.language !== targetLang) {
        i18next.changeLanguage(targetLang);
      }
    }
  }

  useEffect(() => {
    if (queryClientRef.current) {
      import("./features/chat/services/conversation-manager").then(({ convManager }) => {
        convManager.setQueryClient(queryClientRef.current!);
      });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <ContextTree authContext={authContext}>
        <ChatQueryNetworkSync />
        <Main />
      </ContextTree>
    </QueryClientProvider>
  );
}

export default App;
