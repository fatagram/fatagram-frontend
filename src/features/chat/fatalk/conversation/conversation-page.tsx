import { ComponentProps } from "@/components/common/component-type";
import { useNavigate, useParams } from "react-router-dom";
import { ChatPanel } from "../../components/chat-panel";
import { Avatar, MiniButton, Skeleton, Text } from "@/components/atoms";
import Transition, { AnimationLib } from "@/components/ui/utils/transition";
import { convManager, useConversationStore } from "../../services/conversation-manager";
import { useRef, useState } from "react";
import { useGetConversation, useUpdateConversationAvatar } from "../../hooks/use-conversation";
import { useRenderConversationContent } from "../../hooks/use-render-conversation-content";

interface ConversationPageProps extends ComponentProps {}

export const ConversationPage: React.FC<ConversationPageProps> = ({}) => {
  const navigate = useNavigate();
  const { conversationId } = useParams<{ conversationId: string }>();
  const [openSetting, setOpenSetting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const unreadCount = useConversationStore((state) => state.totalUnreadCount);
  const { renderConversationName } = useRenderConversationContent();
  const { fetch: updateAvatar } = useUpdateConversationAvatar(conversationId!);

  const { data: conversationData, isPending: isPendingConversation } = useGetConversation(
    conversationId!,
    undefined,
    true,
  );

  const handleTurnBack = () => {
    navigate("/fatalk");
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !conversationId) return;

    await updateAvatar(
      { file },
      {
        onSuccess: () => {
          convManager.updateConversation(conversationId, { avatarUrl: URL.createObjectURL(file) });
        },
      },
    );
    e.target.value = "";
  };

  return (
    <div className="flex">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <ChatPanel
        conversationId={conversationId!}
        className="w-full h-[calc(100dvh-var(--header-height))]"
        onTurnback={() => navigate("/fatalk")}
        headerLeft={
          <div className="flex items-center gap-1">
            <MiniButton sz="sm" onClick={handleTurnBack} className="block lg:hidden">
              <i className="fa-solid fa-arrow-left text-primary-400" />
            </MiniButton>
            <Transition show={unreadCount > 0} animation={AnimationLib.Fade}>
              <div className="rounded-full bg-primary-500 px-2 text-white">
                <Text className="text-white" weight="bold">
                  {unreadCount}
                </Text>
              </div>
            </Transition>
          </div>
        }
        headerRight={
          <MiniButton sz="sm" onClick={() => setOpenSetting((prev) => !prev)}>
            <i className="fa-solid fa-ellipsis text-primary-400" />
          </MiniButton>
        }
      />
      <Transition
        show={openSetting}
        animation={AnimationLib.SoftFade}
        duration={100}
        className="bg-bg-main border-l border-bg-secondary max-w-[400px] w-[40%]"
      >
        {conversationData && !isPendingConversation ? (
          <div className="flex flex-col items-center px-4 py-6 gap-1">
            <Avatar src={conversationData.avatarUrl || ""} alt="Avatar" sz="lg" />
            <Text sz="lg" weight="bold" wrap="whitespace-pre-wrap" className="text-center">
              {renderConversationName(conversationData)}
            </Text>
            <div className="flex justify-center w-full gap-4 mt-4">
              <MiniButton
                sz="sm"
                className="bg-bg-third"
                title="Sửa avatar"
                onClick={triggerFileInput}
              >
                <i className="fa-solid fa-image" />
              </MiniButton>
              <MiniButton sz="sm" className="bg-bg-third" title="Sửa tên nhóm">
                <i className="fa-solid fa-pen-to-square" />
              </MiniButton>
              <MiniButton sz="sm" className="bg-bg-third" title="Tìm kiếm">
                <i className="fa-solid fa-magnifying-glass" />
              </MiniButton>
            </div>
          </div>
        ) : (
          <div>
            <Skeleton sz="lg" className="mx-auto mb-4" variant="circle" />
            <Skeleton sz="md" className="mx-auto mb-2 w-1/2" />
            <Skeleton sz="sm" className="mx-auto w-1/3" />
          </div>
        )}
      </Transition>
    </div>
  );
};
