import { UserService } from '@/api/user/user.api';
import { useEffect, useMemo, useState } from 'react';

const useUserId = (userParam: string) => {
    const [userId, setUserId] = useState<string | undefined>(undefined);
    const [userExist, setUserExist] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    
    const userService = useMemo(() => new UserService(), []);
    useEffect(() => {
        const fetchUserId = async () => {
            if (!userParam) {
                return;
            }
            const response = await userService.GetProfile(userParam, 'id');
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
    }, [userService, userParam])

    return { userId, loading, userExist };
}

export default useUserId;