import { authService } from "@/api/auth/auth.api";
import LoginDto, { LoginResponse } from "@/api/auth/dto/login.dto";
import { Result } from "@/api/common";
import { userProfileService } from "@/api/user/user_profile.api";
import LoadingPage from "@/pages/loading/LoadingPage";
import { removeRefreshToken, removeRefreshTokenFromSession, setRefreshToken, setRefreshTokenToSession } from "@/utils/token";
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

interface AuthContextType {
    isAuthenticated: boolean | null;
    isLoading: boolean;
    setIsLoading?: () => {};
    login: (loginDto: LoginDto) => Promise<Result<LoginResponse>>;
    logout?: () => Promise<void>;
    refresh?: () => Promise<void>;
    userId?: string;
    urlName?: string;
}

const AuthContext = createContext<AuthContextType>({ 
    isAuthenticated: null, 
    isLoading: true,
    login: () => Promise.resolve({ success: false, data: undefined }),
    logout: () => Promise.resolve(),
    refresh: () => Promise.resolve(),
    userId: undefined,
    urlName: undefined
});

export const AuthProvider = ({children} : { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [userId, setUserId] = useState<string | undefined>(undefined);
    const [urlName, setUrlName] = useState<string | undefined>(undefined);

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
        }
        return result;
    }
    
    const logout = async () => {
        await authService.logout();
        setUserId(undefined);
        setUrlName(undefined);
        setIsAuthenticated(false);
        removeRefreshToken();
        removeRefreshTokenFromSession();
    }

    const checkAuth = useCallback(async () => {
        // const userService = new UserService();
        const result: Result<{userId: string | undefined, urlName: string | undefined}> = await userProfileService.GetMe();
        if (result.success) {
            setUserId(result.data?.userId);
            setUrlName(result.data?.urlName);
        }
        else {
            setUserId(undefined);
            setUrlName(undefined);
            setIsAuthenticated(false);
        }
        setIsLoading(false);
    }, []);

    const refresh = async () => {
        checkAuth();
        console.log('refresh');
    }

    useEffect(() => {
        setIsLoading(true);
        checkAuth();
        setIsAuthenticated(true);
    }, [checkAuth])

    useEffect(() => {
        const handleFocus = () => {
          checkAuth();
        };
      
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
            urlName}}>
                {isLoading || isAuthenticated === null ? <LoadingPage/> : children}
        </AuthContext.Provider> 
    )
}

export const useAuth = () => useContext(AuthContext);