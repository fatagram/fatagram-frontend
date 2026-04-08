import { GlobalDialog } from "./features/components/global-dialog";
import { AppHubListener } from "./features/hub/app-hub-listener";
import AppRoutes from "./routes";

export default function Main() {
  return (
    <>
      <AppRoutes />
      <GlobalDialog />
      <AppHubListener />
    </>
  );
}
