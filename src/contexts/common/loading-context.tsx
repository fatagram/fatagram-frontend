import LoadingPage from "@/pages/loading/loading-page";
import React, { useCallback, useMemo, useState } from "react";

export interface LoadingContextType {
  increment: () => void;
  decrement: () => void;
}

export const LoadingContext = React.createContext<LoadingContextType>({
  increment: () => {},
  decrement: () => {},
});

type LoadingProviderProps = {
  children: React.ReactNode;
};

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => setCount((prev) => prev + 1), []);
  const decrement = useCallback(() => setCount((prev) => Math.max(0, prev - 1)), []);

  const value = useMemo(() => ({ increment, decrement }), [increment, decrement]);

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
};
