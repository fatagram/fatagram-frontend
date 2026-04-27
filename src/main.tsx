import { MediaViewer } from "./features/chat/components/media-viewer/media-viewer";
import { GlobalDialog } from "./features/components/global-dialog";
import { AppHubListener } from "./features/hub/app-hub-listener";
import { OfflineStatusNotification } from "./components/common/offline-status-notification";
import AppRoutes from "./routes";
import { useGetTotalUnreadCount } from "./features/chat/hooks/use-conversation";
import { GlobalBottomSheet } from "./features/components/global-bottom-sheet";

export default function Main() {
  useGetTotalUnreadCount();

  return (
    <>
      <AppRoutes />
      <GlobalDialog />
      <GlobalBottomSheet />
      <MediaViewer />
      <AppHubListener />
      <OfflineStatusNotification />
    </>
  );
}
