import { userProfileService } from '@/api/user/user-profile.api';
import { useEffect, useMemo, useState } from 'react';

const useUserId = (userParam: string) => {
    const [userId, setUserId] = useState<string | undefined>(undefined);
    const [userExist, setUserExist] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);  
    // const userService = useMemo(() => new UserService(), []);
    
    useEffect(() => {
        setLoading(true);
        const fetchUserId = async () => {
            if (!userParam) {
                return;
            }
            const response = await userProfileService.GetProfile(userParam, 'id');
            if (response.success) {
                setUserId(response.data.infos.id);
                setUserExist(true);
            }
            else {
                setUserId(undefined);
                setUserExist(false);
            }
            setLoading(false);
        }
        fetchUserId();
    }, [userProfileService, userParam])

    return { userId, loading, userExist };
}

export default useUserId;