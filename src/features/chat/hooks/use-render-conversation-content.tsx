import { MessageResponseDto } from "@/api/message/dto/message.dto";
import { useAuth } from "@/contexts";
import { Conversation } from "@/types/entities/conversation.type";
import { Message, MessageType } from "@/types/entities/message.type";
import { useTranslation } from "react-i18next";
import { themeDetails } from "@/features/chat/fatalk/conversation/chat-themes.config";

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
    if (message.type === MessageType.ChangeTheme) {
      const { actorName, actorId, theme } = message.metadata || {};
      const actor = userId === actorId ? t("common:conversations.you") : actorName || "Unknown";

      const themeKey = theme || "default";
      const foundThemeObj = themeDetails.find((item: any) => item.key === themeKey);
      const themeName = foundThemeObj ? foundThemeObj.label : "Mặc định";

      return t("common:conversations.systemMessage.changeTheme", {
        actorName: actor,
        theme: themeName,
      });
    }
    if (message.type === MessageType.ChangeBackgroundUrl) {
      const { actorName, actorId } = message.metadata || {};
      const actor = userId === actorId ? t("common:conversations.you") : actorName || "Unknown";
      return t("common:conversations.systemMessage.changeBackgroundUrl", { actorName: actor });
    }
    if (message.type === MessageType.AddParticipant) {
      const { actorName, actorId, addedUserNames } = message.metadata || {};
      const actor = userId === actorId ? t("common:conversations.you") : actorName || "Unknown";
      const names = Array.isArray(addedUserNames) ? addedUserNames.join(", ") : (addedUserNames || "");
      return t("common:conversations.systemMessage.addParticipant", {
        actorName: actor,
        addedUserNames: names,
      });
    }
    return message.content;
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
