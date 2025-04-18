import React, { useEffect } from 'react';
import './App.css';
import './styles/global.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes';
import { LanguageProvider } from './contexts/LanguageContext';


const App: React.FC = () => {
  useEffect(() => {
    document.title = "Fatagram";
  }, []);

  return (
    <AuthProvider>
      <LanguageProvider>
      <ThemeProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
