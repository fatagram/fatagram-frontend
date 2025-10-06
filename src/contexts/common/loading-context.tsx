/* @refresh reload */
import LoadingPage from "@/pages/loading/loading-page";
import React, { use, useCallback, useContext, useMemo, useState } from "react";

export interface LoadingContextType {
  increment: () => void;
  decrement: () => void;
};

export const LoadingContext = React.createContext<LoadingContextType>({
  increment: () => {},
  decrement: () => {},
});

type LoadingProviderProps = {
  children: React.ReactNode;
};

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [count, setCount] = useState(0);

  const stableIncrement = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);
  const stableDecrement = useCallback(() => {
    setCount((prev) => Math.max(0, prev - 1));
  }, []);

  const value = useMemo(
    () => ({
      increment: stableIncrement,
      decrement: stableDecrement,
    }),
    [stableIncrement, stableDecrement],
  );

  return (
    <LoadingContext.Provider value={value}>
      {count > 0 && <LoadingPage />}
      {children}
    </LoadingContext.Provider>
  );
}
