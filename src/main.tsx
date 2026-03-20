import { GlobalDialog } from "./features/components/global-dialog";
import { NotificationListener } from "./features/notifications/components";
import { MessageListener } from "./features/chat/components/message-listener";
import AppRoutes from "./routes";

export default function Main() {
  return (
    <main>
      <AppRoutes />
      <GlobalDialog />
      <NotificationListener />
      <MessageListener />
    </main>
  );
}
