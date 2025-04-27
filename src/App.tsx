import React, { useEffect } from "react";
import "./App.css";
import "./styles/global.css";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes";
import { LanguageProvider } from "./contexts/LanguageContext";

const App: React.FC = () => {

  useEffect(() => {
    document.title = "Fatagram";
  }, []);


  return (
    <LanguageProvider>
      <Router>
        <AppRoutes />
      </Router>
    </LanguageProvider>
  );
};

export default App;
