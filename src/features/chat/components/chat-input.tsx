import { MiniButton, TextArea } from "@/components/atoms";
import { ComponentProps } from "@/components/common/component-type";
import { useSendMessage } from "@/features/hooks/use-message";
import clsx from "clsx";
import { useRef, useState } from "react";

interface ChatInputProps extends ComponentProps {
  conversationId?: string;
  correlationId?: string;
  receiverId?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  conversationId,
  correlationId,
  receiverId,
  className,
}) => {
  const [hasInput, setHasInput] = useState(false);
  const textboxRef = useRef<HTMLTextAreaElement | null>(null);
  const { fetch: send } = useSendMessage();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const isNotEmpty = e.target.value.trim() !== "";
    if (isNotEmpty !== hasInput) {
      setHasInput(isNotEmpty);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    send({
      conversationId,
      correlationId,
      content: textboxRef.current?.value.trim() || "",
      receiverId,
    });
    if (textboxRef.current) {
      textboxRef.current.value = "";
    }
    setHasInput(false);
  };

  return (
    <div className={clsx("px-2 h-[15%] self-end bg-bg-third w-full flex items-center", className)}>
      <TextArea
        sz="sm"
        className="w-full !rounded-full"
        wrapperClassName="flex-1"
        placeholder="Tin nhắn của bạn"
        onKeyDown={handleKeyDown}
        ref={textboxRef}
        onChange={handleInputChange}
        rows={1}
      />
      <MiniButton sz="sm" className="ml-2" onClick={handleSendMessage} disabled={!hasInput}>
        <i className="fa-solid fa-paper-plane text-primary-500"></i>
      </MiniButton>
    </div>
  );
};
