import { UserService } from '../services/User/UserService';
import React from "react";


export function useCheckUserExist(key: string):  [boolean, boolean] {
    const [userExists, setUserExists] = React.useState<boolean>(true);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        const fetchUserExists = async () => {
            try {
                const userService = new UserService();
                const response = await userService.CheckUserExistAsync(key);
                if (response.success) {
                    setUserExists(true);
                } else {
                    setUserExists(false);
                }
            } catch (error) {
                console.error("Error checking user existence:", error);
                setUserExists(false);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchUserExists();
    }, [key]);

    return [userExists, isLoading];
}