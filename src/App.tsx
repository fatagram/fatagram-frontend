import "./i18n";
import i18next from "i18next";
import ContextTree from "./context-tree";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import Main from "./main";
import { useRef } from "react";
import { createQueryPersister } from "./utils/query-persister";
import { ChatQueryNetworkSync } from "./features/chat/components/chat-query-network-sync";

function App({ authContext }: { authContext?: { isAuthenticated?: boolean; userData?: any } }) {
  const queryClientRef = useRef<QueryClient | null>(null);
  const persisterRef = useRef(createQueryPersister());

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
  }

  return (
    <PersistQueryClientProvider
      client={queryClientRef.current}
      persistOptions={{
        persister: persisterRef.current,
        buster: "fatagram-query-cache-v1",
        maxAge: 1000 * 60 * 60 * 24,
      }}
    >
      <ContextTree authContext={authContext}>
        <ChatQueryNetworkSync />
        <Main />
      </ContextTree>
    </PersistQueryClientProvider>
  );
}

export default App;
