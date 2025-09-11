import { authService } from "@/api/auth/auth.api";
import LoginDto, { LoginResponse } from "@/api/auth/dto/login.dto";
import { Result } from "@/api/common";
import { userProfileService } from "@/api/user/user-profile.api";
import LoadingPage from "@/pages/loading/LoadingPage";
import { removeRefreshToken, removeRefreshTokenFromSession, setRefreshToken, setRefreshTokenToSession } from "@/utils/token";
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { LANG_LIST, Language, LanguageProvider, useLanguage } from "./LanguageContext";
import { authEvents } from "@/events/authEvents";
import { useLocation } from "react-router-dom";
// import { useDialog } from "./DialogContext";
import LoginForm from "@/features/auth/components/LoginForm/LoginForm";
import RegisterForm from "@/features/user/components/RegisterForm/RegisterForm";
import { useDispatch } from "react-redux";
import { useDialog } from "./DialogContext";

// Authentication context
interface AuthContextType {
    isAuthenticated: boolean | null;
    isLoading: boolean;
    setIsLoading?: () => {};
    login: (loginDto: LoginDto) => Promise<Result<LoginResponse>>;
    logout?: () => Promise<void>;
    refresh?: () => Promise<void>;
    userId?: string;
    urlName?: string;
    openLoginOverlay: () => void;
    openRegisterOverlay: () => void
}

// Create AuthContext
const AuthContext = createContext<AuthContextType>({ 
    isAuthenticated: null, 
    isLoading: true,
    login: () => Promise.resolve({ success: false, data: undefined }),
    logout: () => Promise.resolve(),
    refresh: () => Promise.resolve(),
    userId: undefined,
    urlName: undefined,
    openLoginOverlay: () => {},
    openRegisterOverlay: () => {}
});

// Create AuthProvider
export const AuthProvider = ({children} : { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Authentication state
    const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
    const [userId, setUserId] = useState<string | undefined>(undefined); // Current user ID
    const [urlName, setUrlName] = useState<string | undefined>(undefined); // Current user URL name

    const location = useLocation();
    const { openDialog, closeDialog } = useDialog();
    // const dispatch = useDispatch();

    const openLoginOverlay = () => {
        openDialog({
            content: <LoginForm showLogo={false}/>,
        })
    }

    const openRegisterOverlay = () => {
        openDialog({    
            content: <RegisterForm showLogo={false}/>,
        })
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isAuthenticated && location.pathname !== "/login" && location.pathname !== "/register") {
                openLoginOverlay();
            } 
            else {
                closeDialog();
            }
        }, 0); // đợi router settle

        return () => clearTimeout(timer);
    }, [isAuthenticated, location.pathname]);

    // Language context (setLanguage to change language)
    const { setLanguage } = useLanguage(); 

    // Function to set language when reload or login
    const setLang = (langCode: string) => {
        if (LANG_LIST.includes(langCode as Language)) {
            setLanguage(langCode as Language);
        }
    }

    // Function to login
    const login = async (loginDto: LoginDto): Promise<Result<LoginResponse>> => {
        const result = await authService.login(loginDto);
        if (result.success) {
            setUserId(result.data?.userId);
            setUrlName(result.data?.urlName);
            if (localStorage.getItem('isRememberMe') === 'true') {
                setRefreshToken(result.data?.refreshToken || '');
            }
            else {
                setRefreshTokenToSession(result.data?.refreshToken || '');
            }
            setIsAuthenticated(true);
            closeDialog();
        }
        return result;
    }
    
    // Function to logout
    const logout = async () => {
        await authService.logout();
        setUserId(undefined);
        setUrlName(undefined);
        setIsAuthenticated(false);
        removeRefreshToken();
        removeRefreshTokenFromSession();
    }

    // Function to check authentication status
    const checkAuth = useCallback(async () => {
        // const userService = new UserService();
        const result: Result<{
            userId: string | undefined, 
            urlName: string | undefined, 
            languageCode: string}> = await userProfileService.GetMe();
        if (result.success) {
            setUserId(result.data?.userId);
            setUrlName(result.data?.urlName);
            setLang(result.data?.languageCode || "en");
        }
        else {
            setUserId(undefined);
            setUrlName(undefined);
            setIsAuthenticated(false);
            // setLoginOverlay(true);
        }
        setIsLoading(false);
    }, []);

    // Function to refresh authentication status
    const refresh = async () => {
        checkAuth();
        // console.log('refresh');
    }

    // Check authentication status on mount
    useEffect(() => {
        setIsLoading(true);
        checkAuth();
        setIsAuthenticated(true);
    }, [checkAuth])

    useEffect(() => {
        const handleFocus = () => {
            checkAuth();
        };
        
        // Set event to check token when re-focusing to window
        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
    }, [checkAuth]);

    return ( 
        <AuthContext.Provider value={{ 
            isAuthenticated, 
            isLoading, 
            login,
            logout,
            refresh,
            userId,
            urlName,
            openLoginOverlay,
            openRegisterOverlay
        }}>
            {isLoading || isAuthenticated === null ? <LoadingPage/> : children}
        </AuthContext.Provider> 
    )
}

export const useAuth = () => useContext(AuthContext);