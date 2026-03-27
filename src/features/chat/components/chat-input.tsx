import { MiniButton, Textbox } from "@/components/atoms";
import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import { useRef, useState } from "react";

interface ChatInputProps extends ComponentProps {
  onSend?: (content: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ className, onSend }) => {
  const [hasInput, setHasInput] = useState(false);
  const textboxRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isNotEmpty = e.target.value.trim() !== "";
    if (isNotEmpty !== hasInput) {
      setHasInput(isNotEmpty);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const content = textboxRef.current?.value.trim() || "";
      if (content) {
        handleSendMessage(content);
      }
    }
  };

  const handleSendMessage = (content: string) => {
    onSend?.(content);
    if (textboxRef.current) {
      textboxRef.current.value = "";
    }
  };

  return (
    <div className={clsx("px-2 h-[15%] self-end bg-bg-third w-full flex items-center", className)}>
      <Textbox
        sz="xs-3"
        className="!rounded-full w-full"
        wrapperClassName="flex-1"
        placeholder="Tin nhắn của bạn"
        onKeyDown={handleKeyDown}
        ref={textboxRef}
        onChange={handleInputChange}
      />
      <MiniButton
        sz="xs-3"
        className="ml-2"
        onClick={() => handleSendMessage(textboxRef.current?.value?.trim() || "")}
        disabled={!hasInput}
      >
        <i className="fa-solid fa-paper-plane text-primary-500"></i>
      </MiniButton>
    </div>
  );
};
