import { ComponentProps } from "@/components/common/component-type";
import { FatalkChatPanel } from "../components/fatalk-chat-panel";
import { useNavigate, useParams } from "react-router-dom";

interface ConversationPageProps extends ComponentProps {}

export const ConversationPage: React.FC<ConversationPageProps> = ({}) => {
  const navigate = useNavigate();
  const { conversationId } = useParams<{ conversationId: string }>();

  return (
    <FatalkChatPanel
      conversationId={conversationId!}
      className=""
      onTurnback={() => navigate("/fatalk")}
    />
  );
};
