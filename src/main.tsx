import { GlobalDialog } from "./components/organisms";
import { NotificationListener } from "./features/notifications/components";
// import { useAuth } from "./hooks/contexts/use-auth";
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
