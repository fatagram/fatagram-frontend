import React from "react";
import "./App.css";
import "./styles/global.css";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { LanguageProvider } from "./contexts/LanguageContext";
import { DialogProvider } from "./contexts/DialogContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";


const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <DialogProvider>
              <BrowserRouter>
                <ToastProvider>
                  <AppRoutes />
                </ToastProvider>
              </BrowserRouter>
          </DialogProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
