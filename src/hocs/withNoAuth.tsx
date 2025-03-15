import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import { getAccessToken } from "../utils/token";


// withNoAuth function
// This function is a higher order component that checks if the user is not authenticated.
// The function takes a component as an argument and returns a new component.
// The new component checks if the user is not authenticated.
// If the user is not authenticated, it renders the original component.
// If the user is authenticated, it redirects the user to the home page.
const withNoAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {

    return (props: any) => {
        const navigate = useNavigate();
        const accessToken = getAccessToken();

        const[isBlocked, setIsBlocked] = useState<boolean>(false);
        const[isChecking, setIsChecking] = useState<boolean>(true);

        useEffect(() => {
            const checkToken = async(): Promise<void> => {
                const authService = new AuthService();
                if (accessToken) {
                    var result = await authService.ping();
                    setIsBlocked(result.success);
                }

                setIsChecking(false);
            }
            checkToken();
        }, [accessToken]);

        if (isChecking) {
            return null;
        }

        if (isBlocked) {
            navigate("/", { replace: true });
            return null;
        }
        else return <WrappedComponent {...props} />;
    }
}


// Export the withNoAuth function
export default withNoAuth;