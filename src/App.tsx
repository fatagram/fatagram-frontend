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
import SettingPage from './pages/settings/SettingPage';
import ThemeSettingPage from './pages/settings/sub_pages/ThemeSettingPage';


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
              <Route path='/settings' element={<SettingPage />}>
                <Route path='account' element={<div>Account Settings</div>} />
                <Route path='privacy' element={<div>Privacy Settings</div>} />
                <Route path='language' element={<div>Language Settings</div>} />
                <Route path='notifications' element={<div>Notifications Settings</div>} />
                <Route path='about' element={<div>About Settings</div>} />
                <Route path='theme' element={<ThemeSettingPage/>}/>
              </Route>
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
