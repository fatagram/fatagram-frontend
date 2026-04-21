import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useChatStore } from "@/features/hooks/use-chat-store";

const getConversationIdsFromMessageQueries = (queryClient: ReturnType<typeof useQueryClient>) => {
  const ids = new Set<string>();
  const queries = queryClient.getQueryCache().findAll({ queryKey: ["messages"] });

  for (const query of queries) {
    const [prefix, conversationId] = query.queryKey;
    if (prefix === "messages" && typeof conversationId === "string") {
      ids.add(conversationId);
    }
  }

  return ids;
};

export const ChatQueryNetworkSync = () => {
  const queryClient = useQueryClient();
  const focusOnId = useChatStore((state) => state.focusOnId);
  const activeIds = useChatStore((state) => state.activeIds);
  const latestFocusRef = useRef<string | null>(focusOnId);
  const latestActiveIdsRef = useRef<string[]>(activeIds);
  const lastSyncKeyRef = useRef<string>("");

  useEffect(() => {
    latestFocusRef.current = focusOnId;
    latestActiveIdsRef.current = activeIds;
  }, [focusOnId, activeIds]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const invalidateMessageQueries = (isOnline: boolean) => {
      const focusId = latestFocusRef.current;
      const activeIdList = latestActiveIdsRef.current;

      const syncKey = `${isOnline ? "online" : "offline"}|${focusId ?? ""}|${activeIdList.join(",")}`;
      // Allow re-triggering online directly if we want to ensure freshness
      // when networks act up, but prevent spamming.
      if (syncKey === lastSyncKeyRef.current && !isOnline) {
        return;
      }
      lastSyncKeyRef.current = syncKey;

      const refetchFullIds = new Set<string>(activeIdList);
      if (focusId) {
        refetchFullIds.add(focusId);
      }

      const cachedConversationIds = getConversationIdsFromMessageQueries(queryClient);
      refetchFullIds.forEach((id) => cachedConversationIds.add(id));

      cachedConversationIds.forEach((conversationId) => {
        const shouldRefetchActive = isOnline && refetchFullIds.has(conversationId);

        void queryClient.invalidateQueries({
          queryKey: ["messages", conversationId],
          refetchType: shouldRefetchActive ? "active" : "none",
        });
      });
    };

    const invalidateSeenQueries = (isOnline: boolean) => {
      const focusId = latestFocusRef.current;
      if (focusId) {
        queryClient.invalidateQueries({
          queryKey: ["conversation", focusId, "participantsSeen"],
          refetchType: isOnline ? "active" : "none",
        });
      }
    };

    const handleOffline = () => {
      invalidateMessageQueries(false);
      invalidateSeenQueries(false);
    };

    const handleOnline = () => {
      invalidateMessageQueries(true);
      invalidateSeenQueries(true);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    if (!navigator.onLine) {
      invalidateMessageQueries(false);
      invalidateSeenQueries(false);
    }

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [queryClient]);

  return null;
};
