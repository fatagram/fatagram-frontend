import "./i18n";
import i18next from "i18next";
import ContextTree from "./context-tree";
import { QueryClient } from "@tanstack/react-query";
import Main from "./main";
import { useEffect, useRef } from "react";
import { ChatQueryNetworkSync } from "./features/chat/components/chat-query-network-sync";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createQueryPersister } from "./utils/query-persist";

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

  useEffect(() => {
    if (queryClientRef.current) {
      import("./features/chat/services/conversation-manager").then(({ convManager }) => {
        convManager.setQueryClient(queryClientRef.current!);
        convManager.hydrate();
      });
    }
  }, []);

  return (
    <PersistQueryClientProvider
      client={queryClientRef.current}
      persistOptions={{
        persister: persisterRef.current,
        buster: "fatagram-query-cache-v1",
        maxAge: 1000 * 60 * 60 * 24,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            const isSuccess = query.state.status === "success";
            const queryKey = query.queryKey as string[];
            const isManualManaged = queryKey.some((key) =>
              ["friendship", "conversations", "friendshipStatus"].includes(key),
            );

            return isSuccess && !isManualManaged;
          },
        },
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
