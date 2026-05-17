import { MessageResponseDto } from "@/api/message/dto/message.dto";
import { useAuth } from "@/contexts";
import { Conversation } from "@/types/entities/conversation.type";
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
    if (message.type === MessageType.ChangeGroupAvatar) {
      const { actorName, actorId } = message.metadata || {};
      return t("common:conversations.systemMessage.changeGroupAvatar", {
        actorName: userId === actorId ? t("common:conversations.you") : actorName || "Unknown",
      });
    }
    if (message.type === MessageType.RenameGroup) {
      const { actorName, actorId, newName } = message.metadata || {};
      return t("common:conversations.systemMessage.renameGroup", {
        actorName: userId === actorId ? t("common:conversations.you") : actorName || "Unknown",
        newName: newName || "",
      });
    }
  };

  const renderConversationName = (conversation: Conversation) => {
    if (conversation?.isGroup && !conversation.name) {
      const topName = conversation.topParticipantNames!;
      const total = conversation.participantCount!;
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
