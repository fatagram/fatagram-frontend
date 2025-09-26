import { userProfileService } from "@/api/user/user-profile.api";
import { useLoading } from "@/contexts/common/loading-context";
import { use, useEffect, useState } from "react";

const useUserId = (userParam: string) => {
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [userExist, setUserExist] = useState<boolean | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserId = async () => {
      if (!userParam) {
        return;
      }
      setIsLoading(true);
      try {
        const response = await userProfileService.GetProfile(userParam, "id");
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network delay
        if (response.success) {
          setUserId(response.data.infos.id);
          setUserExist(true);
        } else {
          setUserId(undefined);
          setUserExist(false);
        }
      } catch (err) {
        setUserId(undefined);
        setUserExist(false);
      }
      finally {
        setIsLoading(false);
      }
    };
    fetchUserId();
  }, [userParam]);

  return { userId, userExist, isLoading };
};

export default useUserId;
