import { useContext } from "react";
import { ProfilePageContext, ProfilePageContextType } from "../context/profile-page-context";

export function useProfilePage(): ProfilePageContextType {
  const context = useContext(ProfilePageContext);
  if (!context) {
    throw new Error("useProfilePage must be used within a ProfilePageProvider");
  }
  return context;
}
