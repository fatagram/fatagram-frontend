import {
  DialogContext,
  DialogContextType,
} from "@/contexts/common/dialog-context";
import { useContext } from "react";

export function useDialog(): DialogContextType {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
}
