import { AuthContext, AuthContextType } from "@/contexts/auth/auth-context";
import { useContext } from "react";

export function useAuth(): AuthContextType {
   return useContext(AuthContext);
}
