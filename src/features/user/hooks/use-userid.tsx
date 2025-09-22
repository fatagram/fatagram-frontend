import { userProfileService } from '@/api/user/user-profile.api';
import { useLoading } from '@/contexts/common/loading-context';
import { useEffect, useState } from 'react';

const useUserId = (userParam: string) => {
    const [userId, setUserId] = useState<string | undefined>(undefined);
    const [userExist, setUserExist] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                if (!userParam) {
                    return;
                }
                const response = await userProfileService.GetProfile(userParam, 'id');
                await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading delay
                if (response.success) {
                    setUserId(response.data.infos.id);
                    setUserExist(true);
                }
                else {
                    setUserId(undefined);
                    setUserExist(false);
                }
            }
            catch (err) { }
            finally {
                setIsLoading(false);
            }
        }
        fetchUserId();
    }, [userProfileService, userParam])

    return { userId, userExist, isLoading };
}

export default useUserId;