import { authService } from "@/api/auth/auth.api";
import LoginDto, { LoginResponse } from "@/api/auth/dto/login.dto";
import { userProfileService } from "@/api/user/user-profile.api";
import { removeRefreshToken, removeRefreshTokenFromSession, setRefreshToken, setRefreshTokenToSession } from "@/utils/token";
import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef } from "react";
import { LANG_LIST, Language, useLanguage } from "../common/language-context";
import { useLocation } from "react-router-dom";
import LoginForm from "@/features/auth/components/login-form";
import RegisterForm from "@/features/user/components/register-form/register-form";
import { useDialog } from "../common/dialog-context";
import { Result } from "@/api/common/result";
import { useLoading } from "../common/loading-context";
import LoadingPage from "@/pages/loading/loading-page";

// Authentication context
interface AuthContextType {
    isAuthenticated: boolean | null;
    login: (loginDto: LoginDto) => Promise<Result<LoginResponse>>;
    logout?: () => Promise<void>;
    userId?: string;
    urlName?: string;
    openLoginOverlay: () => void;
    openRegisterOverlay: () => void
}

// Create AuthContext
const AuthContext = createContext<AuthContextType>({ 
    isAuthenticated: null, 
    login: () => Promise.resolve({ success: false, data: undefined }),
    logout: () => Promise.resolve(),
    userId: undefined,
    urlName: undefined,
    openLoginOverlay: () => {},
    openRegisterOverlay: () => {}
});

type AuthProviderProps = {
    children: React.ReactNode;
}

// Create AuthProvider
export const AuthProvider: React.FC<AuthProviderProps> = ({
    children
}) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Authentication state
    const [userId, setUserId] = useState<string | undefined>(undefined); // Current user ID
    const [urlName, setUrlName] = useState<string | undefined>(undefined); // Current user URL name
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const { setLanguage } = useLanguage(); 
    const { openDialog, closeDialog } = useDialog();
    // const { setIsLoading } = useLoading();
    const location = useLocation();

    const openLoginOverlay = useCallback(() => {
        openDialog({
            content: <LoginForm showLogo={false}/>,
        })
    }, [openDialog]);
    const openRegisterOverlay = useCallback(() => {
        openDialog({    
            content: <RegisterForm showLogo={false}/>,
        })
    }, [openDialog]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (isAuthenticated === false && location.pathname !== "/login" && location.pathname !== "/register") {
                openLoginOverlay?.();
            } 
            else {
                closeDialog?.();
            }
        }, 0); // đợi router settle
        return () => clearTimeout(timer);
    }, [isAuthenticated, location.pathname]); // ← Remove function dependencies

    // Function to set language when reload or login
    const setLang = (langCode: string) => {
        if (LANG_LIST.includes(langCode as Language)) {
            setLanguage(langCode as Language);
        }
    }

    // Function to login
    const login = async (loginDto: LoginDto): Promise<Result<LoginResponse>> => {
        try {
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
        catch (err) {
            return { success: false, data: undefined };
        }
    };
    
    // Function to logout
    const logout = async () => {
        try {    
            await authService.logout();
            setUserId(undefined);
            setUrlName(undefined);
            setIsAuthenticated(false);
            removeRefreshToken();
            removeRefreshTokenFromSession();
        }
        catch (err) {
            console.error("Logout failed:", err);
        }
    };

    const checkAuth = useCallback(async () => {
        // setIsLoading(true);
        try {
            const result = await authService.ping();
            if (!result.success) {
                setUserId(undefined);
                setUrlName(undefined);
                setIsAuthenticated(false);
            }
            else {
                setIsAuthenticated(true);
            }
        }
        catch(err) {
            console.error("Check auth failed:", err);
            setIsAuthenticated(false);
            setUserId(undefined);
            setUrlName(undefined);
        }
        // Intentionally do not touch global loading state here to avoid
        // rapid show/hide (flicker) when lightweight background checks run.
    }, []);

    useEffect(() => {
        const fetchUserOnMount = async () => {
            try {
                const result = await userProfileService.GetMe();
                if (result.success) {
                    setUserId(result.data?.id);
                    setUrlName(result.data?.urlName);
                    setLang(result.data?.languageCode || "en");
                    setIsAuthenticated(true);
                    console.log("User is authenticated");
                } else {
                    setUserId(undefined);
                    setUrlName(undefined);
                    setIsAuthenticated(false);
                }
            } catch (err) {
                console.error("Check auth failed:", err);
                setIsAuthenticated(false);
                setUserId(undefined);
                setUrlName(undefined);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchUserOnMount();
    }, []);

    useEffect(() => {
        const handleFocus = () => {
            checkAuth();
        };
        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
    }, []);

    return ( 
        <AuthContext.Provider value={useMemo(() => ({ 
            isAuthenticated, 
            login,
            logout,
            userId,
            urlName,
            openLoginOverlay,
            openRegisterOverlay
        }), [isAuthenticated, userId, urlName, login, logout, openLoginOverlay, openRegisterOverlay])}>
            {isLoading ? <LoadingPage /> : children}
        </AuthContext.Provider> 
    )
}

export const useAuth = () => useContext(AuthContext);