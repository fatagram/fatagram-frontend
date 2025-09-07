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


const App: React.FC = () => {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
};

export default App;
