import LoadingPage from "../../pages/loading/LoadingPage";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

// withNoAuth function
// This function is a higher order component that checks if the user is not authenticated.
// The function takes a component as an argument and returns a new component.
// The new component checks if the user is not authenticated.
// If the user is not authenticated, it renders the original component.
// If the user is authenticated, it redirects the user to the home page.
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