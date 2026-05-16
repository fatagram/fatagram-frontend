import { ComponentProps } from "@/components/common/component-type";
import { TempChat } from "../../components/temp-chat";
import { useNavigate, useSearchParams } from "react-router-dom";
import clsx from "clsx";

interface TempConversationProps extends ComponentProps {}

export const TempConversation: React.FC<TempConversationProps> = ({ className }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tempId = searchParams.get("tempId");
  const conversationId = `temp-${tempId}`;

  if (!tempId) {
    navigate("/fatalk", { replace: true });
    return null;
  }

  return (
    <TempChat
      conversationId={conversationId}
      className={clsx("h-[calc(100dvh-var(--header-height))]", className)}
      onTurnBack={() => navigate("/fatalk")}
      onSendMessageSuccess={(data) => {
        navigate(`/fatalk/${data?.conversationId}`, { replace: true });
      }}
    />
  );
};
