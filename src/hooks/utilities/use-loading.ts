import { LoadingContext, LoadingContextType } from "@/contexts/common/loading-context";
import { useContext } from "react";

export const useLoading = (): LoadingContextType => {
  return useContext(LoadingContext);
};
