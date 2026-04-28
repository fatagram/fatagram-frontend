import { MediaType, Message, MessageRenderType, MessageType } from "@/types/entities/message.type";
import clsx from "clsx";

export const getMessageBubbleShapeClass = (
  isMyMessage: boolean,
  isFirstMessageInGroup: boolean,
  isLastMessageInGroup: boolean,
  isOnlyMessageInGroup: boolean,
) =>
  clsx(
    isMyMessage ? "rounded-l-3xl self-end" : "rounded-r-3xl self-start",
    isOnlyMessageInGroup && "!rounded-3xl",
    isLastMessageInGroup && (isMyMessage ? "rounded-br-[4px]" : "rounded-bl-[4px]"),
    isFirstMessageInGroup && (isMyMessage ? "rounded-tr-[4px]" : "rounded-tl-[4px]"),
    !isFirstMessageInGroup &&
      !isLastMessageInGroup &&
      (isMyMessage ? "rounded-tr-[4px] rounded-br-[4px]" : "rounded-tl-[4px] rounded-bl-[4px]"),
  );

export const getMessageType = (msg: Message): MessageRenderType => {
  if (msg.type === MessageType.Text) return MessageRenderType.Text;
  if (msg.type === MessageType.Media) {
    if (msg.media?.some((media) => media.type === MediaType.Gif)) return MessageRenderType.Gif;
    if (msg.media?.some((media) => media.type === MediaType.Image)) return MessageRenderType.Image;
    if (msg.media?.some((media) => media.type === MediaType.Video)) return MessageRenderType.Video;
    if (msg.media?.some((media) => media.type === MediaType.Audio)) return MessageRenderType.Audio;
    if (msg.media?.some((media) => media.type === MediaType.File)) return MessageRenderType.File;
  }
  return MessageRenderType.System;
};
