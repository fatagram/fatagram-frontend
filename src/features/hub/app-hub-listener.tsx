import { SocketMessage } from "@/api/common/socket-message";
import { SeenDto, TypingDto } from "@/api/conversation/dto/conversation.dto";
import { MessageResponseDto } from "@/api/message/dto/message.dto";
import { NotificationDto } from "@/api/notification/dto/notification.dto";
import { useAppHub } from "@/features/hub/use-app-hub";
import { useMessageListenerHandler } from "@/features/chat/message-listener";
import { useNotificationListenerHandler } from "@/features/notifications/components/notification-listener";
import { useGetDeltaConversations } from "../chat/hooks/use-conversation";

type AppHubPayload = MessageResponseDto | SeenDto | NotificationDto;

export function AppHubListener() {
  const handleMessageEvent = useMessageListenerHandler();
  const handleNotificationEvent = useNotificationListenerHandler();
  const { fetcherDelta } = useGetDeltaConversations();

  useAppHub<AppHubPayload>(
    async (message: SocketMessage<AppHubPayload>) => {
      console.log("MSG: ", message);
      switch (message.event) {
        case "NewMessage":
        case "SeenMessage":
          await handleMessageEvent(
            message as SocketMessage<MessageResponseDto | SeenDto | TypingDto>,
          );
          break;
        case "UserIsTyping":
        case "UserStoppedTyping":
          await handleMessageEvent(
            message as SocketMessage<MessageResponseDto | SeenDto | TypingDto>,
          );
          break;
        case "NewNotification":
          handleNotificationEvent(message as SocketMessage<NotificationDto>);
          break;
        default:
          break;
      }
    },
    async () => {
      console.log("Reconnected to App Hub, fetching delta conversations...");
      await fetcherDelta();
    },
  );

  return null;
}

export default AppHubListener;
