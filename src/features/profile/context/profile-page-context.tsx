import { createContext, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import NotFoundPage from "@/features/components/not-found-page";
import { useUserId } from "../hooks/use-userid";
import LoadingPage from "@/features/components/loading-page";
import { useAuth } from "@/contexts";

export interface ProfilePageContextType {
  isOwner: boolean;
  targetId: string;
  userParam?: string;
}

export const ProfilePageContext = createContext<ProfilePageContextType>({
  isOwner: false,
  targetId: "",
  userParam: undefined,
});

type ProfilePageProviderProps = {
  children: React.ReactNode;
};

// Using function declaration instead of arrow function for better Fast Refresh compatibility
export default function ProfilePageProvider({ children }: ProfilePageProviderProps) {
  const { userId } = useAuth();
  const userParam = useParams<{ userParam: string }>();
  const { data, isLoading, isPending } = useUserId(userParam.userParam || "");

  const cachedTargetIdRef = useRef<string | undefined>(undefined);

  // Update cached targetId only when we have a valid one
  if (data?.infos.id) {
    cachedTargetIdRef.current = data.infos.id;
  }
  const validTargetId = data?.infos.id || cachedTargetIdRef.current || "";
  const contextValue = useMemo(
    () => ({
      isOwner: userId === validTargetId,
      targetId: validTargetId,
      userParam: userParam.userParam,
    }),
    [userId, validTargetId, userParam.userParam],
  );

  if (isLoading || isPending) {
    return <LoadingPage />;
  }

  // Show NotFoundPage if user doesn't exist (but not while loading)
  if (!data) {
    return <NotFoundPage />;
  }

  // Render children even while loading to prevent targetId from becoming undefined
  return <ProfilePageContext.Provider value={contextValue}>{children}</ProfilePageContext.Provider>;
}
