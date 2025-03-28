import React, { useEffect } from 'react';
import './App.css';
import './assets/styles/global.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import Layout from './components/layout/Layout/Layout';
import NotFoundPage from './pages/not_found/NotFoundPage';
import ProfilePage from './pages/profile/ProfilePage';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedLayout from './components/layout/Layout/ProtectedLayout';
import AuthLayout from './components/layout/Layout/AuthLayout';
import LoginPage from './pages/login/LoginPage';
import RegisterPage from './pages/register/RegisterPage';
import { AuthProvider } from './contexts/AuthContext';
import LoadingPage from './pages/loading/LoadingPage';


const App: React.FC = () => {
  useEffect(() => {
    document.title = "Fatagram";
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route element={<ProtectedLayout />} >
              <Route path='/' element={<HomePage />}/>
            </Route>

            <Route element={<AuthLayout />}>
              <Route path='/login' element={<LoginPage />}/>
              <Route path='/register' element={<RegisterPage />}/>
            </Route>

            <Route element={<Layout />}>
              <Route path='/:userId' element={<ProfilePage />} />
              <Route path='*' element={<NotFoundPage />} />
              <Route path='/loading' element={<LoadingPage />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
