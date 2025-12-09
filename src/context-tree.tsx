import { AuthProvider } from "./contexts/auth/auth-context";
import { ToastProvider } from "./contexts/common/toast-context";
import { DialogProvider } from "./contexts/common/dialog-context";
import { LoadingProvider } from "./contexts/common/loading-context";
import { ThemeProvider } from "./contexts/common/theme-context";
import { SnackbarProvider } from "./contexts/common/snackbar-context";

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
              <ToastProvider>{children}</ToastProvider>
            </SnackbarProvider>
          </DialogProvider>
        </LoadingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
