import React from "react";
import "./App.css";
import "./styles/global.css";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { LanguageProvider } from "./contexts/LanguageContext";
import GlobalDialog from "./components/common/widgets/DialogBox/GlobalDialog";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { DialogProvider } from "./contexts/DialogContext";


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
              </ToastProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </DialogProvider>
    </BrowserRouter>
  );
};

export default App;
