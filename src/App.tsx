import React from "react";
import "./App.css";
import "./styles/global.css";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { LanguageProvider } from "./contexts/LanguageContext";
import { DialogProvider } from "./contexts/DialogContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";


const App: React.FC = () => {

  return (
    <ThemeProvider>
      <AuthProvider>
        <DialogProvider>
          <LanguageProvider>
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
          </LanguageProvider>
        </DialogProvider>
      </AuthProvider>
    </ThemeProvider>

  );
};

export default App;
