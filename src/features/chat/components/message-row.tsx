import { ComponentProps } from "@/components/common/component-type";
import { Message } from "@/types/entities/message.type";
import { Avatar, Text } from "@/components/atoms";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useGetUserProfile } from "@/features/hooks/use-user-profile";
import { useFormatTime } from "@/utils/format-time";
import { useRenderConversationContent } from "../hooks/use-render-conversation-content";
import { isSystemMessage } from "../helpers/conversation-helpers";

interface MessageProps extends ComponentProps {
  message: Message;
  isShowName?: boolean;
  isShowTime?: boolean;
  isFooterVisible?: boolean;
  hasAvatar?: boolean;
  isMyMessage?: boolean;
  messageClassName?: string;
  ref: React.RefObject<HTMLDivElement | null> | null;
}

export const MessageRow: React.FC<MessageProps> = ({
  message,
  isShowName = false,
  isShowTime = true,
  isFooterVisible = true,
  hasAvatar,
  isMyMessage,
  className,
  messageClassName,
  ref,
}) => {
  const { t } = useTranslation();
  const [hasDelayed, setHasDelayed] = useState(false);
  const { data: userInfo } = useGetUserProfile(message.senderId!);
  const { getDiffBetween, formatTime, formatSmartTimestamp } = useFormatTime();
  const { renderSystemMessage } = useRenderConversationContent();
  const isPending = message.status === "pending";
  const isFailed = message.status === "failed";
  const isSystem = isSystemMessage(message.type);

  useEffect(() => {
    if (isPending) {
      setTimeout(() => {
        setHasDelayed(true);
      }, 2000);
    }
  }, [isPending]);

  if (isSystem) {
    return (
      <div className="flex justify-center w-full my-2">
        <Text sz="sm-1" className="opacity-80">
          {renderSystemMessage(message)}
        </Text>
      </div>
    );
  }

  return (
    <div className={clsx("flex flex-col", className)} ref={ref}>
      {isShowTime && (
        <Text sz="xs-1" className="text-center my-2">
          {formatSmartTimestamp(message.createdAt)}
        </Text>
      )}
      <div
        className={clsx(
          "flex gap-2 w-full",
          isMyMessage ? "flex-row-reverse" : "flex-row",
          hasDelayed && "opacity-50",
        )}
      >
        {!isMyMessage && (
          <Avatar
            className={clsx(
              "flex-shrink-0 self-start",
              isMyMessage && "order-2",
              !hasAvatar && "invisible",
            )}
            src={userInfo?.infos.avatar}
            alt="Avatar"
            sz="xs-2"
          />
        )}
        <div className={clsx("flex flex-col", "max-w-[75%]")}>
          {isShowName && (
            <Text
              sz="xs-1"
              className={clsx("mb-1", isMyMessage ? "text-right mr-3" : "text-left ml-3")}
            >
              {userInfo?.infos.fullName}
            </Text>
          )}
          <div
            className={clsx(
              "px-3 py-1 break-all rounded-2xl shadow-sm relative self-end",
              isMyMessage ? (isFailed ? "bg-primary-800" : "bg-primary-600") : "bg-bg-fourth",
              isFailed && "border-red-500 border-2 opacity-50",
              messageClassName,
            )}
          >
            <Text
              sz="sm-1"
              wrap="whitespace-normal"
              className={clsx(isMyMessage ? "text-text-message" : "text-text-main")}
            >
              {message.content}
            </Text>{" "}
            {hasDelayed && (
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
                <div className="w-2 h-2 aspect-square animate-spin rounded-full border-[1.5px] border-gray-300 border-t-transparent"></div>
              </div>
            )}
          </div>
          <div
            className={clsx(
              "flex items-center justify-end mr-2 overflow-hidden transition-all duration-200",
              isFooterVisible ? "h-[15px] mt-1" : "h-0 mt-0",
            )}
          >
            {isFooterVisible && isMyMessage && !isPending && !isFailed && (
              <Text sz="xs-1">
                {t("conversations.sent")}{" "}
                {getDiffBetween(message.createdAt, new Date(), "second") > 60 && (
                  <Text sz="xs-1">{formatTime(message.createdAt)}</Text>
                )}
              </Text>
            )}
          </div>
        </div>
        {isFailed && (
          <div className="flex items-center justify-center">
            <i className="fa-solid fa-circle-exclamation text-red-500"></i>
          </div>
        )}
      </div>
    </div>
  );
};
