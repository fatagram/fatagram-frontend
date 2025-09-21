import React from "react";
import "./App.css";
import "./styles/global.css";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { LanguageProvider } from "./contexts/LanguageContext";
import GlobalDialog from "./components/organisms/Dialog/GlobalDialog";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { DialogProvider } from "./contexts/DialogContext";
import NotificationListener from "./features/notifications/components/NotificationListener";


const App: React.FC = () => {
  return (
    <BrowserRouter>
      <DialogProvider>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <ToastProvider>
                <AppRoutes />
                <GlobalDialog />
                <NotificationListener />
              </ToastProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </DialogProvider>
    </BrowserRouter>
  );
};

export default App;
