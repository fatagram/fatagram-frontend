import { Text, Avatar, MiniButton, Textbox, Skeleton } from "@/components/atoms";
import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import { useChatStore } from "../../hooks/use-chat-store";
import { useGetUserProfile } from "@/features/hooks/use-user-profile";
import { MessageList } from "./message";
import { useMessages, useSendMessage } from "@/features/hooks/use-message";
import { useState } from "react";
import { useGetConversation } from "@/features/hooks/use-conversation";

interface ChatWindowProps extends ComponentProps {
  conversationId: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ className, conversationId }) => {
  const [message, setMessage] = useState("");

  const { toggleMinimize, closeChat, replaceChat, registry } = useChatStore();

  const chat = registry[conversationId];
  const tempTargetId = chat?.type === "temp" ? chat.targetId : undefined;
  const {
    data: tempUser,
    isLoading: isLoadingTempUser,
    isFetching: isFetchingTempUser,
  } = useGetUserProfile(tempTargetId!);
  const {
    data: conversationData,
    isLoading: isLoadingConversation,
    isFetching: isFetchingConversation,
  } = useGetConversation(conversationId);

  const isLoadingHeader =
    isLoadingConversation || isFetchingConversation || isLoadingTempUser || isFetchingTempUser;

  const chatTitle = tempUser
    ? tempUser.infos.fullName
    : conversationData?.name || "Cuộc trò chuyện";

  const chatAvatar = tempUser ? tempUser.infos.avatar : conversationData?.avatarUrl;

  const {
    data: messages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMessages(conversationId, { sortDesc: true, limit: 20 });
  const { fetch: send, isFetching } = useSendMessage();
  const displayedMessages = messages ? messages.pages.flatMap((page) => page.items) : [];

  const handleOnClose = () => {
    closeChat(conversationId);
  };

  const handleOnMinimum = () => {
    toggleMinimize(conversationId);
  };

  const handleSendMessage = () => {
    send(
      {
        conversationId: tempTargetId === undefined ? conversationId : undefined,
        content: message,
        receiverId: tempTargetId,
      },
      {
        onSuccess: (data) => {
          if (tempTargetId) replaceChat(conversationId, data!.conversationId);
          setMessage("");
        },
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && message.trim() !== "") {
      handleSendMessage();
      setMessage("");
    }
  };

  return (
    <div
      className={clsx(
        "w-[330px] h-[450px] bg-black rounded-xl shadow-lg overflow-hidden flex flex-col",
        "border border-gray-700 shadow-xl",
        className,
      )}
    >
      <div className="flex items-center px-4 h-[13%] bg-bg-fourth">
        {isLoadingHeader ? (
          <>
            <Skeleton sz="sm-3" variant="circle" className="w-8" />
            <Skeleton sz="sm-3" className="ml-2 flex-1" />
          </>
        ) : (
          <>
            <Avatar src={chatAvatar} alt="Avatar" sz="xs-3" />
            <Text
              sz="sm-1"
              weight="bold"
              className={clsx(
                "ml-2 text-white flex-1 rounded-md px-2 py-3",
                "hover:bg-gray-700/30 cursor-pointer transition-all duration-200",
                "active:scale-[0.98] active:opacity-80",
              )}
            >
              {chatTitle}
            </Text>
          </>
        )}
        <MiniButton sz="xs-3" onClick={handleOnMinimum}>
          <i className="fas fa-minus"></i>
        </MiniButton>
        <MiniButton sz="xs-3" onClick={handleOnClose}>
          <i className="fa-solid fa-xmark"></i>
        </MiniButton>
      </div>
      <div className="flex flex-col p-2 flex-1 overflow-y-auto">
        {tempTargetId ? (
          <div className="flex flex-col justify-center items-center h-full text-center px-4">
            <div className="relative mb-3">
              <Avatar src={chatAvatar} alt="Avatar" sz="sm-2" />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></span>
            </div>

            <Text sz="sm-1" weight="bold" className="text-white">
              {chatTitle}
            </Text>

            <Text sz="xs-1" className="text-gray-400 mt-1">
              Hai bạn chưa có tin nhắn nào
            </Text>

            <div className="mt-4 px-3 py-2 bg-gray-700/30 rounded-full">
              <Text sz="xs-1" className="text-gray-300">
                Gửi lời chào đầu tiên 👋
              </Text>
            </div>
          </div>
        ) : null}
        <MessageList
          messages={displayedMessages}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      </div>
      <div className="px-2 h-[15%] self-end bg-bg-fourth w-full flex items-center">
        <Textbox
          sz="xs-3"
          className="!rounded-full w-full"
          wrapperClassName="flex-1"
          placeholder="Tin nhắn của bạn"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <MiniButton
          sz="xs-3"
          className="ml-2"
          onClick={handleSendMessage}
          disabled={!message.trim() || isFetching}
        >
          <i className="fa-solid fa-paper-plane"></i>
        </MiniButton>
      </div>
    </div>
  );
};
