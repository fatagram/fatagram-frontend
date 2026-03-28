import { Text, Avatar, MiniButton, Skeleton, Textbox } from "@/components/atoms";
import { ComponentProps } from "@/components/common/component-type";
import { useGetConversationWith } from "@/features/hooks/use-conversation";
import { useSendMessage } from "@/features/hooks/use-message";
import { useGetUserProfile } from "@/features/hooks/use-user-profile";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

interface TempConversationProps extends ComponentProps {}

export const TempConversation: React.FC<TempConversationProps> = ({ className }) => {
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const tempId = searchParams.get("tempId") || undefined;
  const correlationId = location.state?.correlationId;
  const { data: tempUser, isLoading, isFetching } = useGetUserProfile(tempId);
  const { data: conversationData } = useGetConversationWith(tempId || "", undefined, !!tempId);
  const { fetch: sendMessage } = useSendMessage();

  const handleTurnBack = () => {
    navigate("/fatalk");
  };

  useEffect(() => {
    if (conversationData) {
      navigate(`/fatalk/${conversationData.id}`);
    }
  }, [conversationData, navigate]);

  const handleSendMessage = async () => {
    if (!tempId) return;
    console.log("Sending message to temp user:", { tempId, message, correlationId });
    await sendMessage(
      {
        correlationId: correlationId,
        content: message,
        receiverId: tempId,
      },
      {
        onSuccess: (data) => {
          navigate(`/fatalk/${data?.conversationId}`);
        },
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className={clsx(
        "relative flex flex-col bg-bg-main overflow-hidden",
        "h-[calc(100dvh-var(--header-height))]",
        className,
      )}
    >
      <div className="flex items-center gap-3 px-4 h-[60px] bg-bg-second border-b border-gray-700/50 shrink-0">
        {isLoading || isFetching ? (
          <>
            <Skeleton sz="sm-3" variant="circle" className="w-10" />
            <Skeleton sz="sm-3" className="flex-1 max-w-[160px]" />
          </>
        ) : (
          <>
            <MiniButton sz="xs-3" onClick={handleTurnBack} className="block lg:hidden">
              <i className="fa-solid fa-arrow-left text-primary-400" />
            </MiniButton>
            <Avatar src={tempUser?.infos.avatar} alt="Avatar" sz="xs-2" />
            <Text sz="md-1" weight="bold" className="flex-1 text-text-main">
              {tempUser?.infos.fullName}
            </Text>
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 bg-bg-seventh">
        <div className="flex flex-col justify-center items-center h-full text-center px-4">
          <div className="relative mb-4">
            <Avatar src={tempUser?.infos.avatar} alt="Avatar" sz="md-1" />
          </div>
          <Text sz="md-1" weight="bold">
            {tempUser?.infos.fullName}
          </Text>
          <Text sz="sm-1" className="text-gray-400 mt-1">
            Hai bạn chưa có tin nhắn nào
          </Text>
          <div className="mt-5 px-4 py-2 bg-gray-700/30 rounded-full">
            <Text sz="sm-1" className="text-gray-300">
              Gửi lời chào đầu tiên 👋
            </Text>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 bg-bg-second border-t border-gray-700/50 flex items-center gap-2">
        {/* <MiniButton sz="xs-3">
          <i className="fa-solid fa-circle-plus text-primary-400" />
        </MiniButton>
        <MiniButton sz="xs-3">
          <i className="fa-solid fa-image text-primary-400" />
        </MiniButton> */}
        <Textbox
          sz="xs-3"
          className="!rounded-full w-full"
          wrapperClassName="flex-1"
          placeholder="Aa"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <MiniButton sz="xs-3" onClick={handleSendMessage} disabled={!message.trim() || isFetching}>
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
