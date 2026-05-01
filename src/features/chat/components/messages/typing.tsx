import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import { useTypingStore } from "../../hooks/use-typing-store";
import { UserAvatar } from "@/features/components/user-avatar";
import { useShallow } from "zustand/react/shallow";
import { useEffect, useRef, useState } from "react";

interface Props extends ComponentProps {
  userIds: string[];
}

export const Typing: React.FC<Props> = ({ userIds, className }) => {
  return (
    <div className={clsx("flex items-center gap-3", className)}>
      <div className="flex -space-x-3 rtl:space-x-reverse">
        {userIds.map((userId, index) => (
          <UserAvatar
            key={index}
            userId={userId}
            className="ring-2 ring-bg-primary rounded-full"
            style={{ zIndex: 10 - index }}
          />
        ))}
      </div>

      <div className="flex items-center space-x-1 px-3 py-4 bg-bg-fourth rounded-full w-fit">
        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};

export const TypingIndicator = ({ conversationId }: { conversationId: string }) => {
  const typingUserIds = useTypingStore(
    useShallow((state) => state.typingMap[conversationId] || []),
  );

  const [visible, setVisible] = useState(false);
  const [rendered, setRendered] = useState(false);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typingUserIds.length > 0) {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      setRendered(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      hideTimerRef.current = setTimeout(() => setRendered(false), 300);
    }

    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [typingUserIds.length]);

  if (!rendered) return null;

  return (
    <div
      className={clsx(
        "flex flex-col gap-2 px-2 overflow-hidden",
        "transition-all duration-300 ease-in-out",
        visible ? "max-h-16 pb-4 opacity-100 translate-y-0" : "max-h-0 py-0 opacity-0 translate-y-2",
      )}
      style={{ transform: visible ? "translateY(0)" : "translateY(6px)" }}
    >
      <Typing userIds={typingUserIds.length > 0 ? typingUserIds : []} />
    </div>
  );
};

