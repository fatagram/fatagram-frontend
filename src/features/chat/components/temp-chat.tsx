import { Avatar, MiniButton, Skeleton, Text, Textbox } from "@/components/atoms";
import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import React, { useState, useEffect } from "react";
import { useSendMessage } from "@/features/chat/hooks/use-message";
import { useGetUserProfile } from "@/features/hooks/use-user-profile";
import { MessageType } from "@/types/entities/message.type";
import { useOpenChat } from "../hooks/use-open-chat";
import { MessageDto } from "@/api/message/dto/message.dto";

interface Props extends ComponentProps {
  conversationId: string;
  onSendMessageSuccess?: (data: MessageDto) => void;
  onTurnBack?: () => void;
  hideHeader?: boolean;
  headerRight?: React.ReactNode;
  headerLeft?: React.ReactNode;
}

export const TempChat: React.FC<Props> = ({
  conversationId,
  onSendMessageSuccess,
  onTurnBack,
  className,
  hideHeader = false,
  headerRight,
  headerLeft,
}) => {
  const [message, setMessage] = useState("");
  const tempId = conversationId.replace("temp-", "");
  const correlationId = conversationId;

  const { data: tempUser, isLoading, isFetching } = useGetUserProfile(tempId);
  const { checkConversationWith } = useOpenChat();
  const { fetch: sendMessage } = useSendMessage();

  useEffect(() => {
    const checkConversation = async () => {
      if (isLoading) return;
      if (!tempUser) return;

      const hasConversation = await checkConversationWith(tempId);
      if (hasConversation) {
        // If it's a floating window, we might want to handle it differently,
        // but for now, redirecting/switching is handled by the parent or listener as per user.
      }
    };
    checkConversation();
  }, [tempId, tempUser, isLoading]);

  const handleSendMessage = async () => {
    if (!tempId || !message.trim()) return;
    await sendMessage(
      {
        correlationId: correlationId,
        content: message,
        receiverId: tempId,
        type: MessageType.Text,
      },
      {
        onSuccess: (data) => {
          if (data) {
            onSendMessageSuccess?.(data);
          }
        },
      },
    );
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={clsx("relative flex flex-col bg-bg-main overflow-hidden w-full", className)}>
      {!hideHeader && (
        <div className="flex items-center gap-3 px-2 h-[60px] bg-bg-second border-b border-gray-700/50 shrink-0">
          {isLoading || isFetching ? (
            <>
              <Skeleton sz="md" variant="circle" className="w-10" />
              <Skeleton sz="md" className="flex-1 max-w-[160px]" />
            </>
          ) : (
            <>
              {headerLeft}
              {onTurnBack && (
                <MiniButton sz="sm" onClick={onTurnBack} className="block lg:hidden">
                  <i className="fa-solid fa-arrow-left text-primary-400" />
                </MiniButton>
              )}
              <Avatar src={tempUser?.infos.avatar} alt="Avatar" sz="sm" />
              <Text sz="md" weight="bold" className="flex-1 text-text-main truncate">
                {tempUser?.infos.fullName}
              </Text>
              <div className="mr-auto">{headerRight}</div>
            </>
          )}
        </div>
      )}

      <div
        className="flex-1 overflow-y-auto px-4 py-2 bg-bg-seventh flex flex-col"
        data-chat-scrollable="true"
      >
        <div className="flex-1 flex flex-col justify-center items-center text-center px-4">
          <div className="relative mb-4">
            <Avatar src={tempUser?.infos.avatar} alt="Avatar" sz="md" />
          </div>
          <Text sz="md" weight="bold">
            {tempUser?.infos.fullName}
          </Text>
          <Text sz="sm" className="text-gray-400 mt-1">
            Hai bạn chưa có tin nhắn nào
          </Text>
          <div className="mt-5 px-4 py-2 bg-gray-700/30 rounded-full">
            <Text sz="sm" className="text-gray-300">
              Gửi lời chào đầu tiên 👋
            </Text>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 bg-bg-second border-t border-gray-700/50 flex items-center gap-2">
        <Textbox
          sz="sm"
          className="!rounded-full w-full"
          wrapperClassName="flex-1"
          placeholder="Aa"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          type={"text"}
        />
        <MiniButton sz="sm" onClick={handleSendMessage} disabled={!message.trim() || isFetching}>
          <i
            className={clsx(
              "fa-solid",
              message.trim() ? "fa-paper-plane text-primary-500" : "fa-thumbs-up text-primary-400",
            )}
          />
        </MiniButton>
      </div>
    </div>
  );
};
