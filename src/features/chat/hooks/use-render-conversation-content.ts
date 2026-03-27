import { ConversationDto } from "@/api/conversation/dto/conversation.dto";
import { MessageResponseDto } from "@/api/message/dto/message.dto";
import { useAuth } from "@/contexts";
import { Message, MessageType } from "@/types/entities/message.type";
import { useTranslation } from "react-i18next";

export const useRenderConversationContent = () => {
  const { t } = useTranslation();
  const { userId } = useAuth();
  const renderSystemMessage = (message: Message | MessageResponseDto) => {
    if (message.type === MessageType.CreateGroup) {
      const { creatorName, creatorId } = message.metadata || {};
      return t("common:conversations.systemMessage.createGroup", {
        creatorName:
          userId === creatorId ? t("common:conversations.you") : creatorName || "Unknown",
      });
    }
  };

  const renderConversationName = (conversation: ConversationDto) => {
    if (conversation.isGroup && !conversation.name) {
      const topName = conversation.topParticipantNames;
      const total = conversation.participantCount;
      return (
        topName.join(", ") +
        (total > topName.length ? ` và ${total - topName.length} người khác` : "")
      );
    }
    return conversation.name || "Unknown";
  };

  return {
    renderSystemMessage,
    renderConversationName,
  };
};
