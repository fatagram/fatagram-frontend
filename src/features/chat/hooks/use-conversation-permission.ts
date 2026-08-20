import { useConversationStore } from "../services/conversation-manager";
import { type ConversationCapabilitiesDto } from "@/api/conversation/dto/conversation.dto";

const DEFAULT_CAPABILITIES: ConversationCapabilitiesDto = {
  canSendMessage: false,
  canChangeAvatar: false,
  canChangeName: false,
  canChangeTheme: false,
  canChangeBackground: false,
  canKickMember: false,
  canAddMember: false,
  canPinMessage: false,
  canDeleteConversation: false,
};

export function useConversationPermission(conversationId: string): ConversationCapabilitiesDto {
  const conv = useConversationStore((state) =>
    state.conversations.find((c) => c.id === conversationId),
  );

  if (!conv) {
    return DEFAULT_CAPABILITIES;
  }

  // If backend provided capabilities, use them directly
  if (conv.capabilities) {
    return conv.capabilities;
  }

  return DEFAULT_CAPABILITIES;
}
