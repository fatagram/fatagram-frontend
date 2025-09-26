import { AuthState } from "./auth-state";

export interface ProfilePageState extends Omit<AuthState, "lang"> {
  isOwner: boolean;
};