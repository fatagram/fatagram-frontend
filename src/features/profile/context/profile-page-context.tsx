import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import NotFoundPage from "@/pages/not-found/not-found-page";
import { useUserId } from "../hooks/use-userid";
import { useAuth } from "@/hooks/utilities/use-auth";
import { useLoading } from "@/hooks/utilities/use-loading";

export interface ProfilePageContextType {
  isOwner: boolean;
  targetId: string;
  userParam?: string;
}

export const ProfilePageContext = createContext<ProfilePageContextType>({
  isOwner: false,
  targetId: '',
  userParam: undefined
});

type ProfilePageProviderProps = {
  children: React.ReactNode;
}

// Using function declaration instead of arrow function for better Fast Refresh compatibility
export default function ProfilePageProvider({ children }: ProfilePageProviderProps) {
  const { userId } = useAuth();
  const { increment, decrement } = useLoading();
  const userParam = useParams<{ userParam: string }>();
  const { userId: targetId, userExist, isLoading } = useUserId(userParam.userParam || '');
  
  // Track previous loading state to avoid unnecessary increment/decrement calls
  const prevLoadingRef = useRef<boolean | null>(null);
  // Cache the last valid targetId to prevent it from becoming undefined during reload
  const cachedTargetIdRef = useRef<string | undefined>(undefined);
  
  // Update cached targetId only when we have a valid one
  if (targetId) {
    cachedTargetIdRef.current = targetId;
  }

  useEffect(() => {
    // Only call increment/decrement when isLoading actually changes
    if (isLoading !== prevLoadingRef.current) {
      if (isLoading) {
        increment();
      } else if (prevLoadingRef.current !== null) {
        // Only decrement if we've previously incremented (not on initial mount)
        decrement();
      }
      prevLoadingRef.current = isLoading;
    }
  }, [isLoading, increment, decrement]);

  // Memoize context value to prevent unnecessary re-renders of consumers
  // Use cached targetId if current one is undefined (during reload)
  const validTargetId = targetId || cachedTargetIdRef.current || '';
  const contextValue = useMemo(() => ({
    isOwner: userId === validTargetId,
    targetId: validTargetId,
    userParam: userParam.userParam
  }), [userId, validTargetId, userParam.userParam]);

  // Show NotFoundPage if user doesn't exist (but not while loading)
  if (userExist === false) {
    return <NotFoundPage />;
  }

  // Render children even while loading to prevent targetId from becoming undefined
  return (
    <ProfilePageContext.Provider value={contextValue}>
      {children}
    </ProfilePageContext.Provider>
  );
}
