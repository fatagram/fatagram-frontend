import { ComponentType, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import LoadingPage from "../../pages/loading/LoadingPage";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";


const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {

    // AuthComponent function
    // This function is the new component that checks if the user is authenticated.
    return (props: P) => {
        const { isAuthenticated, isLoading } = useAuth();
        const navigate = useNavigate(); 

        useEffect(() => {
            if (!isAuthenticated && !isLoading) {
                navigate('/login', { replace: true });
            }
        }, [isAuthenticated, isLoading, navigate]);

        if (isLoading) return <LoadingPage />;
        return <WrappedComponent {...props} />;
    }
}

// Export the withAuth function
export default withAuth;