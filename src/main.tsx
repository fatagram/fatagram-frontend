import { MediaViewer } from "./features/chat/components/media-viewer/media-viewer";
import { GlobalDialog } from "./features/components/global-dialog";
import { AppHubListener } from "./features/hub/app-hub-listener";
import { OfflineStatusNotification } from "./components/common/offline-status-notification";
import AppRoutes from "./routes";

export default function Main() {
  return (
    <>
      <AppRoutes />
      <GlobalDialog />
      <MediaViewer />
      <AppHubListener />
      <OfflineStatusNotification />
    </>
  );
}
