import { useFetchConversationWith } from "@/features/chat/hooks/use-conversation";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { useChatStore } from "./use-floating-chat";

export const useOpenChat = () => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const { openChat, registry, setFocusOn } = useChatStore(
    useShallow((state) => ({
      openChat: state.openChat,
      registry: state.registry,
      setFocusOn: state.setFocusOn,
    })),
  );
  const { fetch: fetchConversationWith } = useFetchConversationWith();
  const navigate = useNavigate();
  const location = useLocation();

  const _openChat = useCallback(
    (conversationId: string) => {
      if (isMobile || location.pathname.startsWith("/fatalk")) {
        navigate(`/fatalk/${conversationId}`);
      } else {
        openChat(conversationId, { type: "conversation", conversationId });
      }
    },
    [isMobile, location.pathname, navigate, openChat],
  );

  const _openChatWithTarget = useCallback(
    async (targetId: string) => {
      if (registry[`temp-${targetId}`]) {
        if (isMobile || location.pathname.startsWith("/fatalk")) {
          navigate(`/fatalk/temp?tempId=${targetId}`, {
            state: { correlationId: `temp-${targetId}` },
          });
        } else {
          openChat(`temp-${targetId}`, { type: "temp", targetId });
        }
        return;
      }
      await fetchConversationWith(targetId, {
        onSuccess: (data) => {
          if (!data) return;
          if (isMobile || location.pathname.startsWith("/fatalk")) {
            navigate(`/fatalk/${data.id}`);
          } else {
            openChat(data.id, { type: "conversation", conversationId: data.id });
          }
        },
        onError: () => {
          if (isMobile || location.pathname.startsWith("/fatalk")) {
            navigate(`/fatalk/temp?tempId=${targetId}`, {
              state: { correlationId: `temp-${targetId}` },
            });
          }
          openChat(`temp-${targetId}`, { type: "temp", targetId });
        },
      });
    },
    [fetchConversationWith, isMobile, location.pathname, navigate, openChat],
  );

  const _checkConversationWith = useCallback(
    async (tempId: string) => {
      if (registry[`temp-${tempId}`]) {
        return undefined;
      }
      let result: string | undefined;
      await fetchConversationWith(tempId, {
        onSuccess: (data) => {
          result = data?.id;
        },
      });
      return result;
    },
    [registry, fetchConversationWith],
  );

  return {
    openChat: _openChat,
    openChatWithTarget: _openChatWithTarget,
    checkConversationWith: _checkConversationWith,
    setFocusOn,
  };
};
