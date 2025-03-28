import AuthService from "../features/auth/services/AuthService";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
    isAuthenticated: boolean | null;
    isLoading: boolean;
    setAuthenticated?: (isAuthenticated: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({ isAuthenticated: null, isLoading: true, setAuthenticated: (boolean) => {} });

export const AuthProvider = ({children} : { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkAuth = async () => {
            const authService = new AuthService();
            const result = await authService.ping();
            setIsAuthenticated(result.success);
            setIsLoading(false);
        }
        checkAuth();
    }, []);
    
    return <AuthContext.Provider value={{ isAuthenticated, isLoading, setAuthenticated: setIsAuthenticated }}>{children}</AuthContext.Provider> 
}

export const useAuth = () => useContext(AuthContext);