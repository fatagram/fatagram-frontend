import { AuthProvider } from "./contexts/auth-context";
import { ToastProvider } from "./contexts/toast-context";
import { DialogProvider } from "./contexts/dialog-context";
import { LoadingProvider } from "./contexts/loading-context";
import { ThemeProvider } from "./contexts/theme-context";
import { SnackbarProvider } from "./contexts/snackbar-context";
import { MediaViewerProvider } from "./features/chat/context/media-viewer-context";

interface ContextTreeProps {
  children: React.ReactNode;
  authContext?: { isAuthenticated?: boolean; userData?: any };
}
export default function ContextTree({ children, authContext }: ContextTreeProps) {
  return (
    <ThemeProvider>
      <AuthProvider
        initialIsAuthenticated={authContext?.isAuthenticated}
        userData={authContext?.userData}
      >
        <LoadingProvider>
          <DialogProvider>
            <SnackbarProvider>
              <ToastProvider>
                <MediaViewerProvider>{children}</MediaViewerProvider>
              </ToastProvider>
            </SnackbarProvider>
          </DialogProvider>
        </LoadingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
