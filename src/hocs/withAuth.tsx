import { useEffect, useState, ComponentType } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import { getAccessToken } from "../utils/token";


// withAuth function
// This function is a higher order component that checks if the user is authenticated.
// The function takes a component as an argument and returns a new component.
// The new component checks if the user is authenticated.
// If the user is authenticated, it renders the original component.
// If the user is not authenticated, it redirects the user to the login page.
const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {

    // AuthComponent function
    // This function is the new component that checks if the user is authenticated.
    return (props: any) => {
        const navigate = useNavigate();
        const accessToken = getAccessToken();
        // console.log(accessToken);

        const [isAccessed, setIsAccessed] = useState<boolean>(false);
        const [isChecking, setIsChecking] = useState<boolean>(true);

        useEffect(() => {
            const checkToken = async(): Promise<void> => {
                const authService = new AuthService();

                if (accessToken) {
                    var result = await authService.ping();
                    console.log(result);
                    setIsAccessed(result.success);
                }

                setIsChecking(false);
            }

            checkToken();
        }, [accessToken]);

        useEffect(() => {
            if (!isChecking && !isAccessed) {
                navigate("/login", { replace: true });
            }
        }, [isChecking, isAccessed, navigate]);

        if (isChecking) {
            return null;
        }

        if (isAccessed) return <WrappedComponent {...props} />;
        else return null;
    }
}



// Export the withAuth function
export default withAuth;