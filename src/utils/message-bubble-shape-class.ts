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
    isLastMessageInGroup && (isMyMessage ? "rounded-br-none" : "rounded-bl-none"),
    isFirstMessageInGroup && (isMyMessage ? "rounded-tr-none" : "rounded-tl-none"),
    !isFirstMessageInGroup &&
      !isLastMessageInGroup &&
      (isMyMessage ? "rounded-tr-none rounded-br-none" : "rounded-tl-none rounded-bl-none"),
  );
