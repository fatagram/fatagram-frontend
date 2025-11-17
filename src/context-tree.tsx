import { AuthProvider } from "./contexts/auth/auth-context";
import { ToastProvider } from "./contexts/common/toast-context";
import { DialogProvider } from "./contexts/common/dialog-context";
import { LoadingProvider } from "./contexts/common/loading-context";
import { ThemeProvider } from "./contexts/common/theme-context";

interface ContextTreeProps {
  children: React.ReactNode;
}
export default function ContextTree({ children }: ContextTreeProps) {
  return (
    <ThemeProvider>
      <LoadingProvider>
        <DialogProvider>
          <AuthProvider>
            <ToastProvider>{children}</ToastProvider>
          </AuthProvider>
        </DialogProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
}
