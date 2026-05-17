import { Avatar, MiniButton, Skeleton, Text, TextArea, Button } from "@/components/atoms";
import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import React, { useState, useEffect } from "react";
import { useSendMessage } from "@/features/chat/hooks/use-message";
import { useGetUserProfile } from "@/features/hooks/use-user-profile";
import { MessageType } from "@/types/entities/message.type";
import { useOpenChat } from "../hooks/use-open-chat";
import { MessageDto } from "@/api/message/dto/message.dto";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

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
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkConversation = async () => {
      if (isLoading) return;
      if (!tempUser) return;

      const hasConversation = await checkConversationWith(tempId);
      if (hasConversation) {
        // Handled by parent or listener
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      const isMobile = window.matchMedia("(pointer: coarse)").matches;
      if (!isMobile) {
        e.preventDefault();
        handleSendMessage();
      }
    }
  };

  return (
    <div
      className={clsx(
        "relative flex flex-col bg-bg-main overflow-hidden overscroll-none",
        className,
      )}
    >
      {!hideHeader && (
        <div className="flex items-center gap-3 px-2 h-[60px] bg-bg-main border-b border-bg-fourth shrink-0 sticky top-0">
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
              <Avatar className="shrink-0" src={tempUser?.infos.avatar} alt="Avatar" sz="sm" />
              <Text sz="md" weight="bold" className="flex-1 text-text-main truncate">
                {tempUser?.infos.fullName}
              </Text>
              <div className="mr-auto">{headerRight}</div>
            </>
          )}
        </div>
      )}

      <div
        className="flex-1 overflow-y-auto px-4 py-2 bg-bg-main flex flex-col min-h-0"
        data-chat-scrollable="true"
      >
        <div className="flex-1 flex flex-col justify-center items-center text-center px-4">
          {isLoading || isFetching ? (
            <>
              <div className="relative mb-4">
                <Skeleton variant="circle" sz="md" />
              </div>
              <Skeleton sz="sm" className="w-[150px] mb-2" />
              <Skeleton sz="sm" className="w-[200px]" />
            </>
          ) : (
            <>
              <div className="relative mb-4">
                <Avatar src={tempUser?.infos.avatar} alt="Avatar" sz="md" />
              </div>
              <Text sz="sm" weight="bold">
                {tempUser?.infos.fullName}
              </Text>
              <Text sz="xs" wrap="whitespace-normal" className="text-gray-400 mt-1 max-w-[320px]">
                {t("common:conversations.privacyDescription")}
              </Text>
              {tempUser && (
                <Button
                  sz="sm"
                  variant="third"
                  className="mt-4"
                  onClick={() => navigate(`/${tempUser.infos.urlName || tempId}`)}
                >
                  {t("common:conversations.settings.viewProfile")}
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="px-4 py-3 bg-bg-main flex items-center gap-1 relative z-50">
        <div className="flex-1 min-w-0 relative flex items-end">
          <TextArea
            sz="sm"
            className="!rounded-2xl"
            textareaClassName="!pr-10"
            wrapperClassName="flex-1"
            placeholder={t("chat.placeholder", { defaultValue: "Tin nhắn của bạn" })}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={0}
            maxRows={5}
          />
          <div className="absolute right-1">
            <MiniButton className="hover:bg-transparent">
              <i className="fa-solid fa-face-smile text-primary-500"></i>
            </MiniButton>
          </div>
        </div>

        <MiniButton onClick={handleSendMessage} disabled={!message.trim() || isFetching}>
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
