import { GlobalDialog } from "./features/components/global-dialog";
import { NotificationListener } from "./features/notifications/components";
import AppRoutes from "./routes";

export default function Main() {
  return (
    <main>
      <AppRoutes />
      <GlobalDialog />
      <NotificationListener />
    </main>
  );
}
