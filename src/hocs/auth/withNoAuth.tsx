import LoadingPage from "../../pages/loading/LoadingPage";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";


const withNoAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {

    return (props: P) => {
        const { isAuthenticated, isLoading } = useAuth();
        const navigate = useNavigate(); 

        useEffect(() => {
            if (isAuthenticated && !isLoading) {
                navigate('/', { replace: true });
            }
        }, [isAuthenticated, isLoading, navigate]);

        if (isLoading) return <LoadingPage />;
        if (!isAuthenticated) return <WrappedComponent {...props} />;
        return <LoadingPage />;
    }
}

// Export the withNoAuth function
export default withNoAuth;