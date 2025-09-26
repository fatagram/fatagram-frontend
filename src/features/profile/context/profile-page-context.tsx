import { useAuth } from "@/contexts/auth/auth-context";
import { createContext, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import useUserId from "../hooks/use-userid";
import NotFoundPage from "@/pages/not-found/not-found-page";
import { useLoading } from "@/contexts/common/loading-context";

type ProfilePageContextType = {
  isAuthenticated: boolean;
  isOwner: boolean;
  targetId: string;
  userParam?: string;
}

const ProfilePageContext = createContext<ProfilePageContextType>({
  isAuthenticated: false,
  isOwner: false,
  targetId: '',
  userParam: undefined
});

type ProfilePageProviderProps = {
  children: React.ReactNode;
}

export const ProfilePageProvider: React.FC<ProfilePageProviderProps> = ({ children }) => {

  const { isAuthenticated, userId } = useAuth();
  const { increment, decrement } = useLoading();
  const userParam = useParams<{ userParam: string }>();
  const { userId: targetId, userExist, isLoading } = useUserId(userParam.userParam || '');

  useEffect(() => {
    isLoading ? increment() : decrement();
  }, [isLoading]);

  if (userExist === undefined) return null;
  if (!userExist) return <NotFoundPage />;

  return (
    <ProfilePageContext.Provider value={{
      isAuthenticated: isAuthenticated || false,
      isOwner: userId === targetId, // Sửa: so sánh với targetId thay vì userParam
      targetId: targetId || '',
      userParam: userParam.userParam
    }}>
      {children}
    </ProfilePageContext.Provider>
  )
}

export const useProfilePage = () => {
  const context = useContext(ProfilePageContext);
  if (!context) {
    throw new Error("useProfilePage must be used within a ProfilePageProvider");
  }
  return context;
}
