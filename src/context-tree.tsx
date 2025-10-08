import { AuthProvider } from "./contexts/auth/auth-context";
import { LanguageProvider } from "./contexts/common/language-context";
import { ThemeProvider } from "./contexts/common/theme-context";
import { ToastProvider } from "./contexts/common/toast-context";
import { DialogProvider } from "./contexts/common/dialog-context";
import { LoadingProvider } from "./contexts/common/loading-context";

interface ContextTreeProps {
  children: React.ReactNode;
}
export default function ContextTree({ children }: ContextTreeProps) {
  return (
    <ThemeProvider>
      <LoadingProvider>
        <DialogProvider>
          <LanguageProvider>
            <AuthProvider>
              <ToastProvider>{children}</ToastProvider>
            </AuthProvider>
          </LanguageProvider>
        </DialogProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
};
